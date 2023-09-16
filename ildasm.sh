#!/bin/bash

root_dir=$(cd `dirname $0` && pwd -P)

export PATH="/mnt/disk2/work/dotnet/test/bin/Release/net6.0/linux-x64:$PATH"

dll_file_webui="$root_dir/original/Fiddler.WebUi.dll"
ildasm -tok -byt $dll_file_webui -out=Fiddler.WebUi.il
# ilasm -dll -X64 -output=$dll_file_webui Fiddler.WebUi.il
# ilasm -dll -X64 -output=Fiddler.WebUi.dll Fiddler.WebUi.il
# ildasm /tok /byt Fiddler.WebUi.dll /out=Fiddler.WebUi.il

dll_file_sdk="$root_dir/original/FiddlerBackendSDK.dll"
ildasm -tok -byt $dll_file_sdk -out=FiddlerBackendSDK.il
# ilasm -dll -X64 -output=$dll_file_sdk FiddlerBackendSDK.il
# ilasm -dll -X64 -output=FiddlerBackendSDK.dll FiddlerBackendSDK.il