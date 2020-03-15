pushd engine.windows
dotnet build -property:Configuration=Release
bin\Release\engine.windows.exe
popd
