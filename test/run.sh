#!/bin/bash

root_dir=$(cd `dirname $0`/.. && pwd -P)

cd "$root_dir/hook/src"
dotnet build

server_dir=$root_dir/tmp/squashfs-root/resources/app/out/WebServer
lib_dir="$root_dir/hook/src/bin/Debug/net8.0/src.dll"

rm -rf "$server_dir/src.dll"

cp $lib_dir $server_dir

export DOTNET_STARTUP_HOOKS="$server_dir/src.dll"

cd $server_dir
./Fiddler.WebUi --port=8085 $@