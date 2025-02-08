import os
import tkinter as tk
from tkinter import filedialog


def merge_text_files():
    # 윈도우 탐색기 창(디렉토리 선택) 열기
    root = tk.Tk()
    root.withdraw()  # 메인 tkinter 창 숨김

    folder_path = filedialog.askdirectory(title="Select a folder to merge")
    if not folder_path:
        print("폴더가 선택되지 않았습니다.")
        return

    output_file = "merged_files.txt"
    notice = ("각 텍스트 파일은 @@@파일이름.확장자로 구분됩니다.\n"
              "아래 예시처럼 구성됩니다.\n")

    with open(output_file, "w", encoding="utf-8") as out:
        # 첫 줄에 Notice 작성
        out.write(notice + "\n")

        # 선택한 폴더 하위 모든 디렉터리를 재귀적으로 순회
        for root_dir, dirs, files in os.walk(folder_path):
            for file in files:
                # 'package' 문자열이 포함된 파일은 제외
                if file.endswith((".js", ".json")) and "package" not in file:
                    file_path = os.path.join(root_dir, file)

                    # 구분자(파일 경로 포함)
                    rel_path = os.path.relpath(file_path, folder_path)
                    out.write(f"@@@{rel_path}\n")

                    # 파일 내용 작성
                    with open(file_path, "r", encoding="utf-8") as f:
                        out.write(f.read())
                        out.write("\n")  # 파일별 구분을 위해 줄바꿈 추가

    print(f"결과가 '{output_file}'에 저장되었습니다.")

if __name__ == "__main__":
    merge_text_files()
