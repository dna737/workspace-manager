Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.OpenFileDialog
$dialog.Filter = "All files (*.*)|*.*"
$dialog.Multiselect = $true  # Enable multiple file selection
$result = $dialog.ShowDialog()

if ($result -eq [System.Windows.Forms.DialogResult]::OK)
{
    $dialog.FileNames -join "`n"  # Outputs the file paths separated by new lines
}
