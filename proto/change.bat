echo "start change protobuf to ts"
pbjs -t static-module -w commonjs -o proto.js *.proto

pbts -o proto.d.ts proto.js

echo "change finish.."
pause