# SSH

If you can't `ssh` into your Compute Instance, it can get really annoying to create
a new instance. Plus, not to mention if you have any information on the instance that
is gitignored, then you can be in a real pickle.

## Permission Denied

Sometimes, a Compute Instance will reboot or shutdown poorly. And in some cases, there
can be interference with the `.ssh` folder and prevent you from `ssh` into the Compute
Instance. If you get the following error message:

```sh
$ Permission denied (publickey,gssapi-keyex,gssapi-with-mic)
```

This [guide](https://www.ateam-oracle.com/i-can%E2%80%99t-access-my-compute-instance%2C-now-what)
by the `Oracle A-Team` is a really great guide to fixing your problems.
