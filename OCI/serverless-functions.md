# Serverless (Cloud) Functions

Serverless functions, specifically functions-as-a-service (FaaS), are used and maintained on an infrastructure (OCI in our case) for backends and to divide the server into functions so that it can be scaled, only paying whenever an action happens. 

Some official Oracle documentation on creating serverless functions can be found [here](https://docs.oracle.com/en-us/iaas/Content/Functions/Tasks/functionsquickstartlocalhost.htm).

## Function Setup

Note: Some configuration and authentication steps are not necessary if logged in through the OCI Cloud Shell.

Following the serverless functions [tutorial](https://docs.oracle.com/en-us/iaas/Content/Functions/Tasks/functionsquickstartlocalhost.htm), there are several steps you should execute to setup the function. 

### Compartment and Application 

Create the compartment and store an application inside.

1. Navigate to Identity/Compartments in OCI and click ```Create Compartment``` to create a compartment.
2. In Networking, create an appropriate VCN and policy.
3. Go to Functions/Applications and click ```Create Application``` to create an application where the function will be stored.

Then, you should download Docker and check that it is installed with ```docker version```. To check if Docker is running, enter ```docker run hello-world```. 

### API key and OCI profile

Set up the API signing key with an OCI profile with the following.

1. In Profile, click ```User Settings```. Then, click ```API Keys``` and ```Add API Key``` and finally ```Generate API Key Pair```.
2. Click ```Download Private Key``` and put the downloaded key into the local ```~/.oci``` director.
3. Copy the confirguration file into the ```~/.oci/config``` file and change the ```[DEFAULT]``` to the name of your profile and ```key_file``` to the path of the downloaded key in the previous step.

### Fn and Authentication

Setup the local development environment with these next steps.

1. Install Fn Project CLI

On Linux or MacOS

```curl -LSs https://raw.githubusercontent.com/fnproject/cli/master/install | sh```

On MacOS

```brew update && brew install fn```

On Windows, use the Github instructions found [here](https://github.com/fnproject/docs/blob/master/fn/develop/running-fn-client-windows.md#install-fn-client).

Check the installation with ```fn version```. Create a Fn context with ```fn create context <my-context> --provider oracle``` and use the context with ```fn use context <my-context>```. Configure the new Fn with the OCI profile name with ```fn update context oracle.profile <profile-name>```. 

2. Follow these commands to finish Fn configuration.

```
fn update context oracle.compartment-id <compartment-ocid>
fn update context api-url <api-endpoint>
fn update context api-url https://functions.us-phoenix-1.oci.oraclecloud.com
fn update context registry <region-key>.ocir.io/<tenancy-namespace>/<repo-name>
```

3. Click ```User Settings``` in Profile and click ```Generate Token``` in Auth Tokens. Use the token as a password after running ```docker login -u '<tenancy-namespace>/<user-name>' <region-key>.ocir.io```.

### Function Creation

Then, create the function. 

```
fn init --runtime node nodefn
```

Deploy that function after going into the created directory.

```
fn -v deploy --app helloworld-app
```

Invoke that function through the Command Line Interface (CLI) to make sure it is working. The return should be ```{"message":"Hello World!!"}```. 

```
fn invoke helloworld-app nodefn
```

There are a variety of ways to invoke the serverless function that can be found in greater detail [here](https://blogs.oracle.com/developers/post/the-complete-guide-to-invoking-serverless-oracle-functions#invoking-with-http-requests-via-api-gateway).

## Invoking Serverless Function via HTTP Request 

For many applications, serverless functions need to be invoked through an HTTP Request. 

### Setting Correct Policies 

To be able to access the function through a web browser, you need to set the correct policies. Go to the compartment's policies, and add the following as a new policy:

```
ALLOW any-user to use functions-family in compartment [compartment-name] where ALL { request.principal.type = 'ApiGateway' }
```

### HTTP Request from Gateway

You can invoke functions via HTTP Request through the OCI API Gateway. 

1. In OCI, search 'gateway' and navigate to Services/Gateway
2. Click ```Create Gateway```
3. Inside of that gateway, click ```Create Deployment``` in Deployments.
4. Select the appropriate compartment, path, methods, and name. For the backend, select `Oracle Functions` and select the serverless function name that you previously made. 

Now, you should be able to invoke the function in your web browser by setting the URL to the endpoint and appending the previously given path. Another method of invoking the function through HTTP POST request is with the command ```curl -X POST -d "[data]" [endpoint-url]```.