# 8th Wall Web

8th Wall Web: WebAR for mobile devices!

Built entirely using standards-compliant JavaScript and WebGL, 8th Wall Web is a complete implementation of 8th Wall’s Simultaneous Localization and Mapping (SLAM) engine, hyper-optimized for real-time AR on mobile browsers. Features include World Tracking, Image Targets, Face Effects, Lightship Visual Positioning System (VPS), and more.

- - -

# Resources

* [Getting Started Guide](https://github.com/8thwall/web/tree/master/gettingstarted)
* [Documentation](https://www.8thwall.com/docs/web/)
* [8th Wall Website](https://www.8thwall.com)
* [Serving projects locally](https://github.com/8thwall/web/tree/master/serve)

# Examples

* [A-Frame Examples](https://github.com/8thwall/web/tree/master/examples/aframe) (Recommended to start)
* [Babylon.js Examples](https://github.com/8thwall/web/tree/master/examples/babylonjs)
* [three.js Examples](https://github.com/8thwall/web/tree/master/examples/threejs)
* [Camera Pipeline Examples](https://github.com/8thwall/web/tree/master/examples/camerapipeline)




aws s3 sync . s3://3rockariyp.com/BAT_Info --exclude "*.js" --exclude ".git/*" --acl public-read
aws s3 sync . s3://3rockariyp.com/BAT_Info --exclude "*" --exclude ".git/*" --include "*.js" --content-type application/javascript --acl public-read
aws cloudfront create-invalidation --distribution-id E14Q7VKPW1RTSE --paths "/BAT_Info*"

nvm use 16.19.0  
 ./serve/bin/serve -d project