#!/bin/bash

root_dir=$(cd `dirname $0` && pwd -P)

export PATH="/mnt/disk2/work/dotnet/test/bin/Release/net6.0/linux-x64:$PATH"

dll_file_webui="/mnt/disk2/fiddler3.2.0/resources/app/out/WebServer/Fiddler.WebUi.dll"
# ildasm -tok -byt $dll_file_webui -out=Fiddler.WebUi.il
# ilasm -dll -X64 -output=$dll_file_webui Fiddler.WebUi.il
ilasm -dll -X64 -output=Fiddler.WebUi.dll Fiddler.WebUi.il

dll_file_sdk="/mnt/disk2/fiddler3.2.0/resources/app/out/WebServer/FiddlerBackendSDK.dll"
# ildasm -tok -byt $dll_file_sdk -out=FiddlerBackendSDK.il
# ilasm -dll -X64 -output=$dll_file_sdk FiddlerBackendSDK.il
ilasm -dll -X64 -output=FiddlerBackendSDK.dll FiddlerBackendSDK.il