from pydub import AudioSegment
import os
import uuid
import static_ffmpeg
static_ffmpeg.add_paths()

class AudioProcessor:
    def __init__(self, upload_dir="temp", output_dir="temp"):
        self.upload_dir = upload_dir
        self.output_dir = output_dir
        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)

    def remove_vocals(self, input_path: str) -> str:
        """
        Removes vocals using standard phase cancellation for stereo tracks.
        (Center channel extraction: Left - Right)
        """
        try:
            # Load audio
            audio = AudioSegment.from_file(input_path)
            
            # Ensure it's stereo
            if audio.channels < 2:
                # If mono, simply return it (cannot remove vocals via phase cancellation)
                # Or create a fake stereo, but phase cancellation won't work.
                return input_path 
            
            # Split stereo channels
            channels = audio.split_to_mono()
            left_channel = channels[0]
            right_channel = channels[1]
            
            # Invert right channel
            right_channel_inverted = right_channel.invert_phase()
            
            # Merge left and inverted right (Left - Right)
            # This cancels out center-panned audio (usually vocals/bass/kick)
            instrumental = left_channel.overlay(right_channel_inverted)
            
            # Create output filename
            filename = os.path.basename(input_path)
            name, ext = os.path.splitext(filename)
            output_filename = f"{name}_instrumental{ext}"
            output_path = os.path.join(self.output_dir, output_filename)
            
            # Export
            instrumental.export(output_path, format=ext.replace(".", "") or "mp3")
            
            return output_path
            
        except Exception as e:
            print(f"Error processing audio: {e}")
            raise e
