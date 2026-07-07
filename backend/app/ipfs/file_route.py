import logging
from io import BytesIO

import magic
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse

from .client import get_file

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ipfs")


@router.get("/{file_hash}", tags=["ipfs"], response_class=StreamingResponse)
async def get_file_route(
    file_hash: str, filename: str | None = None
) -> StreamingResponse:
    file_content = await get_file(file_hash)
    data = BytesIO(file_content)
    magic_mime = magic.Magic(mime=True)
    mime_type = magic_mime.from_buffer(file_content)
    output_filename = f"{filename or 'download'}.{mime_type.split("/")[-1]}"
    if not mime_type:
        logger.error(f"Could not determine MIME type for file with hash {file_hash}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not determine MIME type for the file.",
        )

    return StreamingResponse(
        data,
        media_type=mime_type,
        headers={
            "Content-Length": str(len(file_content)),
            "Content-Disposition": f'inline; filename="{output_filename}"',
        },
    )
