pushd client
call npm run build
popd
xcopy .\client\build .\webapi\wwwroot /s /e /y
dotnet run -p webapi\webapi.csproj -c Release --urls http://porta630:5000