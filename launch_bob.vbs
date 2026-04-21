Set WshShell = CreateObject("WScript.Shell")
' Executing the batch file in hidden mode (0)
' The second parameter true/false indicates if the script should wait for the command to finish
WshShell.Run "cmd.exe /c start_bob.bat", 0, False
Set WshShell = Nothing
