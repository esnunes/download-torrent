# download-torrent

command line interface to download torrents based on ```magnet uri```.

## usage

```bash
  Usage: download-torrent [options] [magnet uri]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -q, --quiet             Quiet mode
    -i, --stdin             Read magnet uri from stdin
    -o, --stdout            Output list of files after download, implies --quiet
    -d, --output-dir [dir]  Output directory [/Users/nunes/Developer/js/download-torrent]
    -u, --disable-upload    Disable upload
```

### examples

1. download debian 7.7 net inst
```bash
download-torrent "magnet:?xt=urn:btih:e229d3ac324eadc2af60c97350cdb03ba5aae4ed&dn=debian-7.7.0-sparc-netinst.iso&tr=udp://bttracker.debian.org:6969&tr=http://bttracker.debian.org:6969/announce"
```
