# Firewall

Almost all cloud providers have the instance handle it's internal firewall system.
This is great for protection, but a big roadblock for people trying to hack together
a project.

Make sure to read the Oracle documentation on the best practices for compute
instances. You can find the recommendations for firewall rules [here](https://docs.cloud.oracle.com/en-us/iaas/Content/Compute/References/bestpracticescompute.htm?fbclid=IwAR3o07CRSW3GgYg0VzPFoX-vDPjYFT0CYMSwSi1hERWmgzJ_j-M4SR6erKs#Essentia).

## Oracle Linux

Enabling ports in Oracle Linux is quite simple.

```sh
sudo firewall-cmd --permanent --add-port=<port/protocol>

# i.e.
# sudo firewall-cmd --permanent --add-port=3000/tcp
```

To view enabled ports:

```sh
sudo firewall-cmd --list-ports
```

Make sure to reload so that your `iptables` are updated!

```sh
sudo firewall-cmd --reload
```

## Ubuntu

If you search online on how to open up ports, you will most likely find posts on using
`ufw`. `ufw` (Uncomplicated Firewall) is a great tool for traditional methods.
Unfortunately, there currently is an issue with `ufw` and how it interferes with the 
`iptables` of an instance; see issue [here](https://docs.cloud.oracle.com/en-us/iaas/Content/knownissues.htm?fbclid=IwAR1jHwag6OSfeIsPYhOrsWlsURRBMOe9DV0jYYqw1KujzMHIk1KSxoJMLs0#ufw).

So inorder to combat this, you need to work directly with the `iptables`. 

### Adding ports

1. First, save you current rules. 

```sh
sudo iptables-save > ~/current_rules.txt
```

Your rules should look something like this:

```
# Generated by iptables-save v1.8.4 on Tue Dec  8 21:03:14 2020
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [924:417769]
:InstanceServices - [0:0]
-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
-A INPUT -p icmp -j ACCEPT
-A INPUT -i lo -j ACCEPT
-A INPUT -p udp -m udp --sport 123 -j ACCEPT
-A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 3000 -j ACCEPT
-A INPUT -p tcp -m tcp --dport 30000 -j ACCEPT
-A INPUT -j REJECT --reject-with icmp-host-prohibited
-A FORWARD -j REJECT --reject-with icmp-host-prohibited
-A OUTPUT -d 169.254.0.0/16 -j InstanceServices
...
COMMIT
# Completed on Tue Dec  8 21:03:14 2020
```

2. Make a copy of these rules, just in case you screw up somewhere.

```sh
cp ~/current_rules.txt ~/new_rules.txt
```

3. Append your rule to the list.

The way these iptables work is in a switch statement method. The operating system 
will go through every rule in order and preforms the first `true` statement.

As you can see, there is a line 

> `-A INPUT -j REJECT --reject-with icmp-host-prohibited`

that will block all other external inputs at the bottom. We simply need to add our
new rule right above that line!

For example, if we need to open the port of the current instance at port `3000`,
we would add the following line. 

```
...
-A INPUT -p tcp -m tcp --dport 3000 -j ACCEPT
-A INPUT -j REJECT --reject-with icmp-host-prohibited
...
```

Unpacking these commands:
- `-A` means append this rule
- `-p tcp` specifies the *protocol* `tcp`
- `-m tcp` specifies which extended packet matching to apply (this is done implicitly
by the `-p` flag but its a good practice to be explicit)
- `--dport 3000` specifies the destination port to be `3000`
- `-j ACCEPT` means jump to ACCEPT, in other words `return true` 

4. Time to update our `iptables`

To update the iptables, we can run a simple command:

```sh
sudo iptables-restore < ~/new_rules.txt
```

### Resources

If you want to go more indepth with `iptables`.
- You can find the man page [here](https://linux.die.net/man/8/iptables)
- A stack exchange post with both `ufw` and `iptables` [here](https://askubuntu.com/questions/926765/opening-port-with-ip-tables-and-ufw-doesnt-appear-to-open-port?fbclid=IwAR1TDxX9A2sDynSbqJ7XHEFW4VmZnQuQDe2dDXyt8vyZXj6FvAR-LV2yZik)
- A useful Digital Ocean [blog](https://www.digitalocean.com/community/tutorials/iptables-essentials-common-firewall-rules-and-commands)