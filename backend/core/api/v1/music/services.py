import os

def delete_old_file(path_file):
    """ Удаление старого файла
    """
    if os.path.exists(path_file):
        os.remove(path_file)

        folder_path = os.path.dirname(path_file)
        # Удаляем папку, если она пуста
        if os.path.exists(folder_path) and not os.listdir(folder_path):
            os.rmdir(folder_path)