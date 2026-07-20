---
title: "Hey! What's the Apple Watch Screen Resolution?"
slug: "whats-the-apple-watch-screen-resolution"
date: "2014-09-13T05:53:06Z"
excerpt: "Let's put on our smarty-pants and solve this mystery right here."
featuredImage: "/uploads/2014/09/watchsize.jpg"
categories:
  - "f-a-q-s"
  - "resources"
---

<p>Apple unveiled the glamorous new <a href="http://www.apple.com/watch/" target="_blank" rel="noopener noreferrer">Apple Watch</a> on September 9, but they failed to mention what resolution the screen would have. For designers looking to start creating apps for this fancy little device, we're left with the question: "What size do I make my comps?" Let's see if we can put on our smarty-pants and solve this mystery right here.</p>
<p>Some might say resolution-dependent comps are a thing of the past in this multi-device era of liquid responsiveness, but I still like to use Photoshop to quickly set up an initial visual style. With that said, let us begin.</p>
<p>Firstly,<strong> how big is the screen?</strong> Already, we have a trick question. There are two sizes! A manly 42mm version as well and a dainty 38mm for the ladies. By performing a highly unscientific analysis of the screenshots from the <a href="http://www.apple.com/watch/design/" target="_blank" rel="noopener noreferrer">Apple website</a>, we can get a good idea of the aspect ratio and then the width.</p>
<p><a href="/uploads/2014/09/watchsize.jpg"><img class="alignnone size-full wp-image-1620" src="/uploads/2014/09/watchsize.jpg" alt="watchsize" width="1510" height="696" /></a></p>
<p>Next question: <strong>Do the two sizes have a different resolution?</strong> Or, to rephrase it, would Apple really add hours of frustration to the lives of developers and designers, just for 4mm? Let's hope not, and assume they both display the same pixel dimensions, and that the small one's just a little crisper than the big one.</p>
<p>That still doesn't tell us much about the actual <strong>pixel density</strong>. But neither did Apple. And that actually does tell us something. It means there was no major breakthrough in screen resolution to get a display to fit onto your wrist. If there was, we would have heard the disembodied voice of Jony Ive waxing poetically about it over semi-pornographic close-ups of polished aluminium chip-faces.</p>
<p>So if it wasn't a big breakthrough, then surely they'd use the best they've got - especially if they're concerned about <a href="http://www.theverge.com/2014/9/9/6129023/apple-designed-a-custom-typeface-for-the-apple-watch-just-like-google-did-for-android" target="_blank" rel="noopener noreferrer">maximizing the legibility of typefaces</a> at such a small size. So the best they seem to have available was unveiled the same day for the iPhone6 plus.</p>
<section class="fb-section"><div class="fb-row"><div class="fb-col fb-col-100"><figure class="wp-caption"><a href="/uploads/2014/09/iphone_res.jpg"><img class="wp-image-1621 size-full" src="/uploads/2014/09/iphone_res.jpg" alt="iphone_res" width="2000" height="1043" /></a><figcaption>401 pixels per inch seems like plenty.</figcaption></figure>
<p>So assuming the smallest size device (32.3mm x 38mm) is using the best possible resolution (401ppi), we can quickly run the numbers through Photoshop's image size dialog.</p>
<p><a href="/uploads/2014/09/watchres2.jpg"><img class="alignnone size-full wp-image-1622" src="/uploads/2014/09/watchres2.jpg" alt="watchres2" width="1536" height="221" /></a></p>
<p>Flipping the millimeters to pixels shows a resolution of 509 x 600. 600 is a remarkably elegant number, but I've never heard of an odd number of pixels on a screen, so I'll assume my measurements were off by a bit and call it:</p>
<p><center>
<h2><del datetime="2014-09-15T17:26:30+00:00">510 x 600</del></h2>
&nbsp;</p>
<p></center>That's my guess, at least. Feel free to post your alternate theories in the comments.</p>
<p><em>UPDATE: September 15, 2014</em><br />
Something important that was brought to my attention in the comments is that the entire watch face is not used for the display. There's actually a generous black border around the rendering area. Once we take that into account, using the same 401ppi resolution for the 38mm version, we get a height of 480px (another number that commonly occurs in display sizes). The final dimensions then come out to:</p>
<p><center>
<h2><del datetime="2015-01-23T23:37:02+00:00">386 x 480</del></h2>
&nbsp;</p>
<p></center><a href="/uploads/2014/09/imagesize.jpg"><img class="alignnone size-full wp-image-1635" src="/uploads/2014/09/imagesize.jpg" alt="imagesize" width="1880" height="1134" /></a></p>
<p><em>UPDATE: January 23, 2015</em><br />
The answer to this question was answered when Apple released the <a href="https://developer.apple.com/watchkit/" target="_blank" rel="noopener noreferrer">Apple Watch SDK</a> in November 2014. The correct answer is:</p>
<h2>272⨉340 and 312⨉390</h2>
<p>Thank you for playing.</div>
</div>
</section></p>
