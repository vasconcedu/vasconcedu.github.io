Title: How I became a contributor to the Linux kernel
Date: 2026-04-29 20:07
Category: Linux


After finishing [Linux Foundation's course on kernel development (LFD103)](https://training.linuxfoundation.org/training/a-beginners-guide-to-linux-kernel-development-lfd103/), I was feeling ready and eager to make my first contribution to the Linux kernel. The entire process from starting LFD103 and having my first patch accepted into upstream took me two weeks. This post provides insight on what my first patch was about and describes the submission process.

> IMPORTANT: the timespan to my first accepted patch was relatively short, but I didn't start from zero: I already had some 15 years or experience with Linux both as a hobby and as a professional tool--including the experience of compiling Linux From Scratch--, considerable programming experience in C, and almost 10 years of experience in security engineering. Due to this background, I was able to go from no experience in kernel development to an accepted patch relatively faster than average, so my debut as a kernel newbie may differ from that of most people.

### Patch no. 1

As a first exercise of what I had learned in LFD103, I decided to make a very simple and unrisky contribution to the DRM subsystem, namely fixing a comment. I've prepared a patch and sent it on April 24, 2026. Here's the link to it on the kernel archives:

[https://lore.kernel.org/all/20260424140515.2019-1-eduardo@eduardovasconcelos.com/](https://lore.kernel.org/all/20260424140515.2019-1-eduardo@eduardovasconcelos.com/).

There was a typo on a word, and my patch fixed it. After a while, I noticed that I had made a mistake: I had forgotten to apply column limiting both to my commit subject and to my commit message! [Kernel contribution guidelines](https://www.kernel.org/doc/html/latest/process/submitting-patches.html) take formatting very seriously, and as much as I knew from browsing [lore.kernel.org](https://lore.kernel.org/) that mistakes like these might even go unnoticed, I wanted to make sure to follow the entire submission process accordingly, so I decided to submit a second version of my patch.

### Patch no. 1 v2

Subsequent versions of patches must follow specific submission guidelines. After fixing some Emacs line wrapping rules to make sure my commit would be formatted accordingly this time--FIY I was a Vim user for more than a decade before converting, but that's another story--, I have prepared and tagged my patch as `v2`, and sent it the same day, on April 24, 2026:

[https://lore.kernel.org/all/20260424183630.3764-1-eduardo@eduardovasconcelos.com/](https://lore.kernel.org/all/20260424183630.3764-1-eduardo@eduardovasconcelos.com/)

This process--and the fact that I made a submission mistake and had to send a second version of my patch--gave me a good understanding of the submission process, and made me a lot more confident about it. I felt ready to look for opportunities to contribute with some actual code changes.

### Patch no. 2

LFD103 discusses kernel compilation and the patch submission process, but it doesn't teach you about any kernel drivers or subsystems, so submitting patches consisting of substantial changes to kernel code was a no-no.

That's why I decided to look at a simpler driver for a piece of hardware I'm very much passionate about: `thinkpad_acpi`. This driver is under `/drivers/platform/x86/lenovo/thinkpad_acpi.c`, and it interfaces with general IBM/Lenovo ThinkPad HW. Among other things, it controls hotkey events, battery charging, LED activation, lid closing events, etc. What's nice about this driver is that since I own two ThinkPads and my wife owns another one, I had plenty of real HW available to test any changes that I made.

So I decided to look for opportunities to submit code improvements to this driver. After some code reviewing, I found one: there was an unneeded `goto` statement in the [hotkey polling routine, namely `hotkey_kthread()`](https://git.kernel.org/pub/scm/linux/kernel/git/next/linux-next.git/tree/drivers/platform/x86/lenovo/thinkpad_acpi.c#n2461): the routine had a single exit location, with no cleanup code preceding its `return` statement, but it still performed a `goto` jump to its only exit location, introducing unneeded control flow logic in disaccordance with [the Linux kernel coding style, that explicitly mandates otherwise](https://www.kernel.org/doc/html/latest/process/coding-style.html#centralized-exiting-of-functions).

I refactored the routine's exit, compiled and installed the kernel with the change on my old ThinkPad T420si, and after confirming that everything was working as expected, I submitted the patch on the ungodly hour of 3:40 a.m. on April 25, 2026:

[https://lore.kernel.org/all/20260425063936.9360-1-eduardo@eduardovasconcelos.com/](https://lore.kernel.org/all/20260425063936.9360-1-eduardo@eduardovasconcelos.com/)

### Patch no. 2 accepted

Mark Pearson acknowledged my submission and applied his revision tag to it a few hours later, at 9:49 a.m.:

[https://lore.kernel.org/all/16d45e47-8234-4983-84d4-91b66c5a67db@app.fastmail.com/](https://lore.kernel.org/all/16d45e47-8234-4983-84d4-91b66c5a67db@app.fastmail.com/)

### Patch no. 2 applied

Maintainer Ilpo Järvinen reported that he had applied my patch to his next tree on April 28, 2026:

[https://lore.kernel.org/all/177739236303.10973.18101852287173259208.b4-ty@linux.intel.com/](https://lore.kernel.org/all/177739236303.10973.18101852287173259208.b4-ty@linux.intel.com/)

### Patch no. 1 accepted

In the meantime, my initial patch to the DRM subsystem had also been reviewed by maintainer Thomas Zimmermann, who applied his revision tag to it:

[https://lore.kernel.org/all/23bd7123-f22e-4ab2-b3f0-03833e25bf7d@suse.de/](https://lore.kernel.org/all/23bd7123-f22e-4ab2-b3f0-03833e25bf7d@suse.de/)

### Next steps

This exercise of submitting a couple of patches gave me an initial grasp at the contribution process. None of the reviewers pointed out any mistakes or inconsistencies on my initial patches, so I assume that I have understood the submission process and the documentation that I read so far sufficiently well. Under such circumstances, I felt ready to transition towards studying the kernel more deeply as a preparation to tackle more substantial contributions.

That is why I have pivoted to studying the Linux kernel architecture and some of its main subsystems. I'm currently working on Kaiwan N. Billimoria's _Linux Kernel Programming_ book--currently doing module development--, and in the near future, I intend to leverage my experience as a security engineer to specialize in kernel security. It feels like a natural path to take. So after I develop an initial broad understanding of the kernel, I intend to narrow down to AppArmor, then pivot to SELinux, and gradually work towards a broader understanding of LSM.