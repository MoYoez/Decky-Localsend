"""
File utilities for file operations.
Note: This module does NOT use decky directly. Logging is done via callbacks.
"""

import os
import glob
import time
import json
from typing import Dict, List, Any, Callable, Optional


def list_folder_files(
    folder_path: str,
    logger: Callable[[str], None] = None
) -> Dict[str, Any]:
    """
    List all files in a folder recursively.
    
    Args:
        folder_path: Path to the folder
        logger: Optional logging callback
    
    Returns:
        Dictionary with success status and file list
    """
    if not folder_path or not os.path.isdir(folder_path):
        return {"success": False, "error": "Invalid folder path", "files": []}
    
    try:
        files = []
        base_name = os.path.basename(os.path.normpath(folder_path))
        
        for root, _, filenames in os.walk(folder_path):
            for filename in filenames:
                abs_path = os.path.join(root, filename)
                rel_path = os.path.relpath(abs_path, folder_path)
                # Display path includes the folder name for clarity
                display_path = os.path.join(base_name, rel_path)
                
                files.append({
                    "path": abs_path,
                    "displayPath": display_path,
                    "fileName": filename,
                })
        
        return {
            "success": True,
            "files": files,
            "folderName": base_name,
            "count": len(files)
        }
    except Exception as e:
        if logger:
            logger(f"Failed to list folder files: {e}")
        return {"success": False, "error": str(e), "files": []}


def get_steam_screenshots(
    limit: int = 50,
    logger: Callable[[str], None] = None
) -> Dict[str, Any]:
    """
    Get Steam screenshots sorted by time.
    
    Args:
        limit: Maximum number of screenshots to return
        logger: Optional logging callback
    
    Returns:
        Dictionary with success status and screenshot list
    """
    try:
        screenshots = []
        # Support multiple image formats
        patterns = [
            "~/.local/share/Steam/userdata/*/760/remote/*/screenshots/*.jpg",
        ]
        
        for pattern in patterns:
            expanded = os.path.expanduser(pattern)
            files = glob.glob(expanded)
            screenshots.extend(files)
        
        # Get file info and sort by modification time (newest first)
        screenshot_info = []
        for filepath in screenshots:
            try:
                stat = os.stat(filepath)
                screenshot_info.append({
                    "path": filepath,
                    "filename": os.path.basename(filepath),
                    "size": stat.st_size,
                    "mtime": stat.st_mtime,
                    "mtime_str": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(stat.st_mtime))
                })
            except Exception as e:
                if logger:
                    logger(f"Failed to get info for {filepath}: {e}")
                continue
        
        # Sort by modification time (newest first)
        screenshot_info.sort(key=lambda x: x["mtime"], reverse=True)
        
        # Limit results
        screenshot_info = screenshot_info[:limit]
        
        if logger:
            logger(f"Found {len(screenshot_info)} screenshots")
        
        return {
            "success": True,
            "screenshots": screenshot_info,
            "count": len(screenshot_info)
        }
        
    except Exception as e:
        if logger:
            logger(f"Failed to scan screenshots: {e}")
        return {
            "success": False,
            "error": str(e),
            "screenshots": [],
            "count": 0
        }


def load_receive_history(
    history_path: str,
    logger: Callable[[str], None] = None
) -> List[Dict[str, Any]]:
    """
    Load file receive history from disk.
    
    Args:
        history_path: Path to the history file
        logger: Optional logging callback
    
    Returns:
        List of history entries
    """
    try:
        os.makedirs(os.path.dirname(history_path), exist_ok=True)
        
        # Create empty receive history file if it doesn't exist
        if not os.path.exists(history_path):
            if logger:
                logger(f"Receive history file not found, creating empty: {history_path}")
            with open(history_path, "w", encoding="utf-8") as f:
                json.dump([], f, ensure_ascii=False, indent=2)
            return []
        
        # Load existing receive history
        with open(history_path, "r", encoding="utf-8") as f:
            history = json.load(f)
        
        if logger:
            logger(f"Loaded {len(history)} receive history records")
        return history
    except Exception as e:
        if logger:
            logger(f"Failed to load receive history: {e}")
        return []


def save_receive_history(
    history_path: str,
    history: List[Dict[str, Any]],
    logger: Callable[[str], None] = None
) -> bool:
    """
    Save receive history to disk.
    
    Args:
        history_path: Path to the history file
        history: List of history entries
        logger: Optional logging callback
    
    Returns:
        True if successful, False otherwise
    """
    try:
        os.makedirs(os.path.dirname(history_path), exist_ok=True)
        with open(history_path, "w", encoding="utf-8") as f:
            json.dump(history, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        if logger:
            logger(f"Failed to save receive history: {e}")
        return False


def create_receive_history_entry(
    folder_path: str,
    files: List[str],
    title: str = "",
    is_text: bool = False,
    text_content: str = "",
    current_count: int = 0
) -> Dict[str, Any]:
    """
    Create a new receive history entry.
    
    Args:
        folder_path: Path to the received files folder
        files: List of file names
        title: Optional title
        is_text: Whether this is a text-only entry
        text_content: Text content (for text entries)
        current_count: Current history count (for generating ID)
    
    Returns:
        History entry dictionary
    """
    entry = {
        "id": f"recv-{int(time.time() * 1000)}-{current_count}",
        "timestamp": time.time(),
        "title": title or ("Text Received" if is_text else "File Received"),
        "folderPath": folder_path,
        "fileCount": len(files),
        "files": files,
        "isText": is_text,
    }
    
    # Add text content preview for text items (truncate if too long)
    if is_text and text_content:
        entry["textPreview"] = text_content[:200] + ("..." if len(text_content) > 200 else "")
        entry["textContent"] = text_content
    
    return entry
