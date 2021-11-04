# Serverless (Cloud) Functions

Serverless functions are used and maintained on an infrastructure (OCI) so that a new server is spun up each time an application is accessed. This makes it so that it is not necessary to have an instance running at all times, and used when no data needs to be stored from session to session as serverless functions are stateless.

Some official Oracle documentation on creating serverless functions can be found [here](https://docs.oracle.com/en-us/iaas/Content/Functions/Tasks/functionsquickstartlocalhost.htm).

There are a variety of ways to invoke the serverless function that can be found [here](https://blogs.oracle.com/developers/post/the-complete-guide-to-invoking-serverless-oracle-functions#invoking-with-http-requests-via-api-gateway).

## Function Setup

Note: The configuration and authentication steps are not necessary if logged in through the OCI Cloud Shell.

Following the linked tutorial above, you should create a compartment, VCN, and application in the compartment. Then, you should setup docker and download API key and configuration information. The config information should be put into the ~/.oci directory, into the ~/.oci/config file. 

You should then setup the fn (contexts, auth token, login to registry through docker).

Then, create the function. 

```
fn init --runtime java hello-java
```

Deploy that function after going into the created directory.

```
fn -v deploy --app helloworld-app
```

Invoke that function through the Command Line Interface (CLI) to make sure it is working. 

```
fn invoke helloworld-app hello-java
```

## Invoking Serverless Function via HTTP Request 

For many applications, serverless functions need to be invoked through an HTTP Request. 

### Setting Correct Policies 

To be able to access the function through a web browser, you need to set the correct policies. Go to the compartment's policies, and add the following as a new policy:

```
ALLOW any-user to use functions-family in compartment aurgy where ALL { request.principal.type = 'ApiGateway' }
```

### 

You can invoke functions via HTTP Request through the OCI API Gateway. Create the public gateway and inside that gateway, create a deployment. 

The deployment can be made from scratch. You select the compartment, path, methods, and name.

For the backend, select `Oracle Functions` and select the serverless function name that you previously made. 

Now, you should be able to invoke the function in your web browser by setting the URL to the endpoint and appending the previously given path.



