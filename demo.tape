# Assemble — Demo (VHS script)
# Generate GIF: vhs demo.tape
# Requires: https://github.com/charmbracelet/vhs

Output demo.gif
Set FontSize 14
Set Width 800
Set Height 500
Set Shell "bash"
Set Theme "Catppuccin Mocha"

Type "npx create-assemble" Enter
Sleep 2s
Type "english" Enter
Sleep 500ms
Type "english" Enter
Sleep 500ms
Type "0" Enter
Sleep 500ms
Type "." Enter
Sleep 500ms
Type "./assemble-output" Enter
Sleep 500ms
Type "Y" Enter
Sleep 5s
