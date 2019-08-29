pushd client
call npm run build
popd
xcopy .\client\build .\webapi\wwwroot /s /e /y