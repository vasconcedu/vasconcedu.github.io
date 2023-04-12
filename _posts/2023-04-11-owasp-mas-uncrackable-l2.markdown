---
layout: post
title:  "OWASP MAS UnCrackable L2"
date:   2023-04-11 22:43:33 -0300
categories: android
---

Salutes from Araraquara! 

This post contains my solution to one of the [OWASP MAS Android Crackmes,](https://mas.owasp.org/crackmes/Android/) namely UnCrackable L2.

## Getting the APK 

First of all, we need to download the APK. 

UnCrackable L2 is available [here.](https://github.com/OWASP/owasp-mastg/raw/master/Crackmes/Android/Level_02/UnCrackable-Level2.apk)

## App Behavior 

After downloading and installing the APK, we give it a run in order to see how it behaves. After we start the app, an activity containing a single input and a button gets displayed. It looks like we're supposed to submit a so called secret string: 

<img src="/images/ss-fieC4mieshahChiemohyaaTh9roPaiK3.png" width="300" />

If we submit the wrong secret string, then the app displays an error message: 

<img src="/images/ss-kahkoo6aephoh1iaph3shoocooCaungo.png" width="300" />

[Just as for UnCrackable L1,](/android/2023/04/11/owasp-mas-uncrackable-l1.html) it looks like we're supposed to guess the correct secret string that'll solve the challenge.

## Reversing the APK 

After reversing the APK using JADX, we can follow its execution flow in order to understand where said secret string is coming from. 

Here's what `.MainActivity#onCreate` looks like:

```java
/* JADX INFO: Access modifiers changed from: protected */
/* JADX WARN: Type inference failed for: r0v4, types: [sg.vantagepoint.uncrackable2.MainActivity$2] */
@Override // android.support.p019v7.app.ActivityC0345c, android.support.p006v4.app.ActivityC0100h, android.support.p006v4.app.ActivityC0152z, android.app.Activity
public void onCreate(Bundle bundle) {
    init();
    if (C0584b.m7a() || C0584b.m6b() || C0584b.m5c()) {
        m3a("Root detected!");
    }
    if (C0583a.m8a(getApplicationContext())) {
        m3a("App is debuggable!");
    }
    new AsyncTask<Void, String, String>() { // from class: sg.vantagepoint.uncrackable2.MainActivity.2
        /* JADX INFO: Access modifiers changed from: protected */
        @Override // android.os.AsyncTask
        /* renamed from: a */
        public String doInBackground(Void... voidArr) {
            while (!Debug.isDebuggerConnected()) {
                SystemClock.sleep(100L);
            }
            return null;
        }

        /* JADX INFO: Access modifiers changed from: protected */
        @Override // android.os.AsyncTask
        /* renamed from: a */
        public void onPostExecute(String str) {
            MainActivity.this.m3a("Debugger detected!");
        }
    }.execute(null, null, null);
    this.f1996m = new CodeCheck();
    super.onCreate(bundle);
    setContentView(R.layout.activity_main);
}
```

Here's what happens:

- First off, `#onCreate` calls a method named `#init`; 
- Next, it perfoms what seems like a couple of rooted device and debugger checks;
- After that, it registers an `AsyncTask`, namely an asynchronous task that runs in background repeatedly. Such task seems to perform debugger checks;
- Finally, `#onCreate` instantiates something called `.CodeCheck`.

We'll look at each of the above in detail. First, let's find out what `#init` is all about...

Well, it turns out that `#init` is a native method:

```java
private native void init();
```

It seems to be defined in external library `foo`:

```java
static {
    System.loadLibrary("foo");
}
```

We'll get back to that in a minute. 

After we examine the rooted device and debugger checks that follow, we can confirm our hypothesis: that's just what they are. In fact, they're [exactly the same as the ones we have seen when we tackled UnCrackable L1,](/android/2023/04/11/owasp-mas-uncrackable-l1.html) so we won't discuss them in detail here. 

Now to the asyncronous task. `AsyncTask#doInBackground` is looping over the following excerpt: 

```java
while (!Debug.isDebuggerConnected()) {
    SystemClock.sleep(100L);
}
```

It calls `Debug#isDebuggerConnected` and, if this returns `false`, then the task goes to sleep for 100 milliseconds. After it wakes up, a new call to `Debug#isDebuggerConnected` is performed, and the process repeats over and over. Note that this prevents `AsyncTask#doInBackground` from returning. Shall `Debug#isDebuggerConnected` return `true`, then the loop exits and `AsyncTask#doInBackground` finally returns, which in turn triggers `AsyncTask#onPostExecute`. Such method calls `#m3a` with message "Debugger detected!". In turn, `#m3a` displays an error message and makes the app exit:

```java
/* JADX INFO: Access modifiers changed from: private */
/* renamed from: a */
public void m3a(String str) {
    AlertDialog create = new AlertDialog.Builder(this).create();
    create.setTitle(str);
    create.setMessage("This is unacceptable. The app is now going to exit.");
    create.setButton(-3, "OK", new DialogInterface.OnClickListener() { // from class: sg.vantagepoint.uncrackable2.MainActivity.1
        @Override // android.content.DialogInterface.OnClickListener
        public void onClick(DialogInterface dialogInterface, int i) {
            System.exit(0);
        }
    });
    create.setCancelable(false);
    create.show();
}
```

<!-- Where is `Debug#isDebuggerConnected`? --> 

As for `.CodeCheck`, here's what it looks like:

```java
/* loaded from: classes.dex */
public class CodeCheck {
    private native boolean bar(byte[] bArr);

    /* renamed from: a */
    public boolean m4a(String str) {
        return bar(str.getBytes());
    }
}
```

It's got a single method, namely `#m4a`, which is a wrapper to a native method named `#bar`. We'll get back to this one too.

After all this, `#onCreate` inflates `.MainActivity`'s layout. The last method in `.MainActivity` is `#verify`:

```java
public void verify(View view) {
    String str;
    String obj = ((EditText) findViewById(R.id.edit_text)).getText().toString();
    AlertDialog create = new AlertDialog.Builder(this).create();
    if (this.f1996m.m4a(obj)) {
        create.setTitle("Success!");
        str = "This is the correct secret.";
    } else {
        create.setTitle("Nope...");
        str = "That's not it. Try again.";
    }
    create.setMessage(str);
    create.setButton(-3, "OK", new DialogInterface.OnClickListener() { // from class: sg.vantagepoint.uncrackable2.MainActivity.3
        @Override // android.content.DialogInterface.OnClickListener
        public void onClick(DialogInterface dialogInterface, int i) {
            dialogInterface.dismiss();
        }
    });
    create.show();
}
```

Such method gets called whenever the user clicks `.MainActivity`'s "Verify" button, as per `activity_main.xml`:

```xml
<Button android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="@string/button_verify" android:onClick="verify"/>
```

What it does is it fetches the value of `edit_text`, which it then passes as an argument to `.CodeCheck#m4a`. Depending on the value `#m4a` returns, `#verify` either displays an error message, stating that the secret is incorrect, or a success message, stating that the secret is correct and the challenge has been solved.

In order to understand how the check `#m4a` performs works, as well as what `#init` does, we'll proceed to reversing the native library the app utilizes, namely `foo`.

## Reversing the Native Library

First off, we need to obtain the library's binary. In order to do that, we can simply unzip the APK and then navigate into `lib/x86` to find file `libfoo.so`, which is the lib's shared object.

Next, we just have to reverse it using Ghidra to take a look at its exports:

<img src="/images/uncrackable-l2-exports.png" width="480" />

Among them, we find `#init` and `#bar`. 

### init

Here's what `#init`'s decompiled code looks like: 

```c
void Java_sg_vantagepoint_uncrackable2_MainActivity_init(void)

{
  FUN_00010720();
  DAT_00014008 = 1;
  return;
}
```

And here's what we'll see if we delve into `#FUN_00010720`:

```c
void FUN_00010720(void)

{
  __pid_t __pid;
  long lVar1;
  __pid_t _Var2;
  int in_GS_OFFSET;
  pthread_t pStack_20;
  uint local_1c;
  int local_18;
  
  local_18 = *(int *)(in_GS_OFFSET + 0x14);
  DAT_00014004 = fork();
  if (DAT_00014004 == 0) {
    __pid = getppid();
    lVar1 = ptrace(PTRACE_ATTACH,__pid,0,0);
    if (lVar1 == 0) {
      waitpid(__pid,(int *)&local_1c,0);
      while( true ) {
        ptrace(PTRACE_CONT,__pid,0,0);
        _Var2 = waitpid(__pid,(int *)&local_1c,0);
        if (_Var2 == 0) break;
        if ((local_1c & 0x7f) != 0x7f) {
                    /* WARNING: Subroutine does not return */
          _exit(0);
        }
      }
    }
  }
  else {
    pthread_create(&pStack_20,(pthread_attr_t *)0x0,FUN_000106c0,(void *)0x0);
  }
  if (*(int *)(in_GS_OFFSET + 0x14) == local_18) {
    return;
  }
                    /* WARNING: Subroutine does not return */
  __stack_chk_fail();
}
```

Let's break this down...

- The first few lines of code define local variables;
- Then comes `local_18 = *(int *)(in_GS_OFFSET + 0x14);`. This is compiler code. Here, `local_18` is used to validate that the stack hasn't been corrupted before the function returns. [The segment register (`%gs`) is used for that purpose.](https://stackoverflow.com/questions/9249315/what-is-gs-in-assembly) `local_18` receives a reference to a stack canary stored at `%gs + 0x14` and, right before the function returns, another excerpt of compiler code checks the canary's integrity by comparing it to the value stored at `local_18`. If everything is okay, then the function returns normally. Otherwise, `#__stack_chk_fail` raises a stack overflow;
- Then, there's the code inbetween those constructs. First, there's `DAT_00014004 = fork();`. Basically, this is a syscall to `fork(2)`. What it does is it creates a child process by duplicating the calling process. Its return value depends on who's observing it: `DAT_00014004` will hold the PID of the child process in the parent process, and 0 in the child process. We see that the execution flow from that point onwards is different for the parent process and the child process.

### Child Process 

For the child process (i.e. `if (DAT_00014004 == 0) {`), what happens is it gets the PID of the parent process with `__pid = getppid();`, then uses the value in `__pid` to perform a syscall to `ptrace(2)`. Basically, `ptrace(2)` (from `man`):
    
> provides a means by which one process (the "tracer") may observe and control the execution of another process (the "tracee"), and examine and change the tracee's memory and registers.
    
`ptrace(2)` gets called with the following arguments: 

- `PTRACE_ATTACH`: means the calling process will become a tracer of the process whose PID is specified (the latter becomes the calling process' tracee). Furthermore, from `man`: 

    > The tracee is sent a SIGSTOP, but will not necessarily have stopped by the completion of this call; use waitpid(2) to wait for the tracee to stop.

- `__pid`: which is the PID of the parent process;
- `0`: same as `NULL`, as the third argument has no use for `PTRACE_ATTACH`; and
- `0`: same as `NULL`, as the fourth argument has no use for `PTRACE_ATTACH`.

So basically, what the child process is doing is it's attaching to the parent process. Next, what it does is it checks the return value of the call to `ptrace(2)`, which should be 0 if everything is okay. 

Next, the child calls `waitpid(2)`, just like `man ptrace` oriented, as a means to wait for the state transition of the parent process. The child process gets suspended until this happens, then continues execution and enters the following infinite loop:

```c
while( true ) {
    ptrace(PTRACE_CONT,__pid,0,0);
    _Var2 = waitpid(__pid,(int *)&local_1c,0);
    if (_Var2 == 0) break;
    if ((local_1c & 0x7f) != 0x7f) {
                /* WARNING: Subroutine does not return */
        _exit(0);
    }
}
```

It then restarts the parent process with `ptrace(PTRACE_CONT,__pid,0,0);`, and then starts monitoring parent process state changes with `_Var2 = waitpid(__pid,(int *)&local_1c,0);`, by suspending itself until a parent process state change happens.

When a state change happens to the parent process, the child process checks `local_1c` for the status of the change in question to determine if it corresponds to a termination by delivery of a signal (both macros `WTERMSIG` and `WIFSTOPPED` -- see `man waitpid` -- will respond to `0x7f`), in which case the child process exits.

If a different status occurs, the child process simply calls `ptrace(PTRACE_CONT,__pid,0,0);`, which in turn restarts the parent process. 

### Parent Process 

As for the parent process (i.e. `else {`), it'll create a new thread with the following arguments: 
- `&pStack_20`: this is a buffer where the ID of the newly created thread will be stored;
- `(pthread_attr_t *)0x0`: same as `NULL`, so the new thread is created using default attributes;
- `FUN_000106c0` refers to the function the new thread calls to start its execution; and
- `(void *)0x0`: same as `NULL`, meaning no arguments are passed to `#FUN_000106c0` as the new thread calls it. 

That being said, here's what `#FUN_000106c0` looks like: 

```c
void FUN_000106c0(void)

{
int local_20 [6];

waitpid(DAT_00014004,local_20,0);
if (local_20[0] == 0xb) {
                    /* WARNING: Subroutine does not return */
    pthread_exit((void *)0x0);
}
                    /* WARNING: Subroutine does not return */
_exit(0);
}
```

What this function does is it waits for state changes to happen to the child process (remember `DAT_00014004` resolves to the PID of the child process here) with `waitpid(DAT_00014004,local_20,0);`. After a state change happens, the parent checks for the status of the change in question by looking at `local_20[0]` to determine if it corresponds to a termination by delivery of a signal (both macros `WTERMSIG` and `WIFSTOPPED` -- see `man waitpid` -- will respond to `0xb`), in which case the parent process exits.

### So What's All This About? 

It turns out this thing works as a protection to debugging. As a matter of fact, after one process has been attached to another one, it can no longer be attached to additional processes, so a debugger wouldn't be able to attach to it. 

We can now get back to the second exported method in `foo`, namely `#bar`.

### bar

Here's what method `#bar` looks like:

```java
undefined4
Java_sg_vantagepoint_uncrackable2_CodeCheck_bar(int *param_1,undefined4 param_2,undefined4 param_3)

{
  char *__s1;
  int iVar1;
  undefined4 uVar2;
  int in_GS_OFFSET;
  undefined4 local_30;
  undefined4 local_2c;
  undefined4 local_28;
  undefined4 local_24;
  undefined2 local_20;
  undefined4 local_1e;
  undefined2 local_1a;
  int local_18;
  
  local_18 = *(int *)(in_GS_OFFSET + 0x14);
  if (DAT_00014008 == '\x01') {
    local_30 = 0x6e616854;
    local_2c = 0x6620736b;
    local_28 = 0x6120726f;
    local_24 = 0x74206c6c;
    local_20 = 0x6568;
    local_1e = 0x73696620;
    local_1a = 0x68;
    __s1 = (char *)(**(code **)(*param_1 + 0x2e0))(param_1,param_3,0);
    iVar1 = (**(code **)(*param_1 + 0x2ac))(param_1,param_3);
    if (iVar1 == 0x17) {
      iVar1 = strncmp(__s1,(char *)&local_30,0x17);
      if (iVar1 == 0) {
        uVar2 = 1;
        goto LAB_00011009;
      }
    }
  }
  uVar2 = 0;
LAB_00011009:
  if (*(int *)(in_GS_OFFSET + 0x14) == local_18) {
    return uVar2;
  }
                    /* WARNING: Subroutine does not return */
  __stack_chk_fail();
}
```

By examining the decompiled code, we find that `#bar` performs a rather promising string comparison using `iVar1 = strncmp(__s1,(char *)&local_30,0x17);`. Namely, `#bar` compares its string argument (which is `param_3`, to whom `__s1` seems to point) against <i>something</i> (referenced by `local_30`). This <i>something,</i> very likely, is the secret string we're after. Now, if we take a look at what is stored between `local_30` and `local_1a`, we find that it points to a string, namely: 

<img src="/images/uncrackable-l2-ghidra.png" width="800" />

In other words: 

```
6873696620656874206c6c6120726f6620736b6e616854
```

This is Hex ASCII. We can use Burp Decoder to decode it to readable format: 

<img src="/images/uncrackable-l2-burp.png" width="600" />

Or "Thanks for all the fish". This is, indeed, the secret string we've been looking for:

<img src="/images/ss-Piezae0eNg1baiwoom9zai7xah3pumei.png" width="300" />

## Wrap Up 

This is it. We've successfully extracted the secret string using plain good old static analysis and Ghidra.

Have a good one! :)
