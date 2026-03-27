# backend/tests/test_video.py
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from unittest.mock import MagicMock, patch
import pytest
from video import download_clip, compile_reel


@patch("video.requests.get")
def test_download_clip_writes_file(mock_get, tmp_path):
    mock_resp = MagicMock()
    mock_resp.iter_content.return_value = [b"chunk1", b"chunk2"]
    mock_resp.__enter__ = lambda s: s
    mock_resp.__exit__ = MagicMock(return_value=False)
    mock_get.return_value = mock_resp

    dest = str(tmp_path / "clip.mp4")
    download_clip("https://cdn.nba.com/clip.mp4", dest)

    assert os.path.exists(dest)
    with open(dest, "rb") as f:
        assert f.read() == b"chunk1chunk2"


@patch("video.ffmpeg")
def test_compile_reel_calls_ffmpeg_and_returns_path(mock_ffmpeg, tmp_path):
    clip1 = str(tmp_path / "a.mp4")
    clip2 = str(tmp_path / "b.mp4")
    for p in [clip1, clip2]:
        open(p, "wb").close()

    mock_stream = MagicMock()
    mock_ffmpeg.input.return_value = mock_stream
    mock_ffmpeg.concat.return_value = mock_stream
    mock_stream.output.return_value = mock_stream
    mock_stream.overwrite_output.return_value = mock_stream

    out = str(tmp_path / "out.mp4")
    result = compile_reel([clip1, clip2], out)

    assert result == out
    mock_stream.run.assert_called_once_with(quiet=True)


def test_compile_reel_raises_on_empty_input():
    with pytest.raises(ValueError, match="No clips"):
        compile_reel([], "/tmp/out.mp4")
