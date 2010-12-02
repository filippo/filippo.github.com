---
layout: post
title: How to extract a range of lines from a file
disqus_uid: how-to-extract-a-range-of-lines-from-a-file
---
{{ page.title }}
================
Yesterday one of our customers had accidentaly deleted all their products from the database.

Backup and unix filters to the rescue!
--------------------------------------
We got the most recent backup of the database and grepped to find the lines we had to restore.
Then used head and tail to extract the part we needed and restored it.

Let's see how you can extract a range of lines using head and tail. Here is the example file called ex.txt:
{% highlight text %}
line number 1
line number 2
line number 3
line number 4
line number 5
line number 6
line number 7
{% endhighlight %}

Suppose you want to extract from line number 3 to line number 5 you can do it in 2 ways using head and tail:
{% highlight sh %}
head -5 ex.txt | tail -3
{% endhighlight %}
` head -5 ` extracts the first 5 lines from ex.txt and passes them to ` tail -3 ` to get the last 3 lines.

Or you can do the same with:
{% highlight sh %}
tail -n+3 ex.txt | head -3
{% endhighlight %}

Here with ` tail -n+3 ` you extract lines from 3 to the end of the file and with ` head -3 ` you get the first 3 lines.
