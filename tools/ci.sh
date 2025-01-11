#!/bin/bash
root_dir=$(cd `dirname $0`/.. && pwd -P)
cd $root_dir/hook
dotnet publish
cd src/bin/Release/net8.0/publish
ls -l

mkdir -p $root_dir/tmp
tar -czf $root_dir/tmp/hook.tar.gz .
