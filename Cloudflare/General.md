# General

We use Cloudflare to manage all of our DNS applications for Creative Labs. You can
use it to proxy an SSL connection between an `A Record` and a client and a whole lot
more.

## SSL

The internet is a scary place. There are restrictions nowadays that prevent most users
from going on websites that aren't safe. A basic example of this comes down to the 
comparison between HTTP and HTTPS. In order to comply with this, all connections
that a user makes essentially have to follow the rules of SSL encryption. However,
making a SSL certificate is tedious. 

Cloudflare lets us avoid all of those troubles by allowing for Flexible encryption. 
Cloudflare, in many ways, acts as a proxy between our client to our server. Allowing
us to have an HTTPS connect to an originally HTTP server.

To enable this, make sure you have the `Proxy status` set to `Proxied`. And the client
can now safely communicate to Cloudflare through SSL encryption, while Cloudflare can
then interact with the server through an HTTP connection.

**Note: This means that your server should be hosted on port 80**

## A Records

`A Records` are used to map a subdomain to an IP Address. We use this frequently for
our servers. For example, we use `A Records` in `Agora`, where we map the subdomain
`atlas.creativelabsucla.com` to the OCI load balancer at IP address `158.101.25.6`.

## CNAME

A `CNAME` is a Canonical Name Record or Alias Record. Simply, it is an alias between
one domain and another. For example, we use a `CNAME` with all of our Netlify deploys.
In order to do this, we must add the domain we are using as an alias to Netlify,
giving the domain permission to alias the Netlify deploy.

For example, we use `CNAME` in `Sunshine`, by aliasing the root website
`creativelabsucla.com` to `cl-official.netlify.app` and assigning 
`creativelabsucla.com` as a domain in the Netlify console.
