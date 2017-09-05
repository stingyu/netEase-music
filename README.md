# netEase-music
预览
## 移动端深坑1：
fixed定位
## 移动端深坑2：
audio的canplay事件
在安卓下，触发canplay事件，会有下面问题：

360浏览器的audio.seekable为false;
uc浏览器，魅族自带浏览器，微信的audio.buffered.length居然为0；
在iOS下，有以下问题：

canplay事件触发后，微信的audio.seekable为 false；
safari在load了之后，canplay事件不触发，点击play后才触发 （9.1版本是正常的）；

