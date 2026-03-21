from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import os
import sys
from typing import Optional
import traceback

app = FastAPI(title="PyACT-R Tutorial Backend")

# Configure CORS - Fixed for compatibility
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174",  # Vite alternative port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeExecutionRequest(BaseModel):
    code: str
    timeout: Optional[int] = 10

class CodeExecutionResponse(BaseModel):
    output: str
    error: Optional[str] = None
    execution_time: Optional[float] = None

@app.get("/")
async def root():
    return {"message": "PyACT-R Tutorial Backend", "status": "running"}

@app.post("/api/execute", response_model=CodeExecutionResponse)
async def execute_code(request: CodeExecutionRequest):
    """Execute PyACT-R code safely in a subprocess"""

    # Create a temporary file for the code
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        # Add imports and setup
        setup_code = """
import sys
import io
from contextlib import redirect_stdout, redirect_stderr

# Capture output
output_buffer = io.StringIO()
error_buffer = io.StringIO()

try:
    with redirect_stdout(output_buffer), redirect_stderr(error_buffer):
"""

        # Indent user code
        indented_code = '\n'.join(['        ' + line for line in request.code.split('\n')])

        cleanup_code = """
except Exception as e:
    error_buffer.write(f"Error: {type(e).__name__}: {str(e)}\\n")
    import traceback
    error_buffer.write(traceback.format_exc())

# Print captured output
output = output_buffer.getvalue()
error = error_buffer.getvalue()

if output:
    print(output, end='')
if error:
    print(error, end='', file=sys.stderr)
"""

        f.write(setup_code)
        f.write(indented_code)
        f.write(cleanup_code)
        f.flush()

        temp_filename = f.name

    try:
        # Execute the code in a subprocess
        import time
        start_time = time.time()

        result = subprocess.run(
            [sys.executable, temp_filename],
            capture_output=True,
            text=True,
            timeout=request.timeout
        )

        execution_time = time.time() - start_time

        # Combine stdout and stderr
        output = result.stdout
        if result.stderr:
            output += "\n" + result.stderr

        return CodeExecutionResponse(
            output=output or "No output",
            error=None if result.returncode == 0 else f"Exit code: {result.returncode}",
            execution_time=execution_time
        )

    except subprocess.TimeoutExpired:
        return CodeExecutionResponse(
            output="",
            error="Code execution timed out",
            execution_time=request.timeout
        )
    except Exception as e:
        return CodeExecutionResponse(
            output="",
            error=f"Execution error: {str(e)}",
            execution_time=None
        )
    finally:
        # Clean up temporary file
        try:
            os.unlink(temp_filename)
        except:
            pass

@app.get("/api/health")
async def health_check():
    """Check if PyACT-R is available"""
    try:
        import pyactr
        return {
            "status": "healthy",
            "pyactr_version": pyactr.__version__ if hasattr(pyactr, '__version__') else "unknown"
        }
    except ImportError:
        return {
            "status": "unhealthy",
            "error": "PyACT-R not installed"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)