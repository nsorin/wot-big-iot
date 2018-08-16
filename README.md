# Web of Things for BIG IoT - Final Thesis project

TypeScript implementation of an application used to link W3C's WoT project and the BIG IoT project (used in my Master Thesis).

## Installation

After cloning the repository, run ```npm install``` to install dependencies. This will also clone two other projects from github
and install them. Make sure you meet the requirements for the https://github.com/eclipse/thingweb.node-wot project.

Run ```npm run build``` or simply ```tsc``` at the root of the project to build it.

## How to use

To use the API, you need a configuration file. Start by creating a copy of the ```config.json.example``` file. The default location
for the config file is at the root of the project with the name ```config.json```, but you can also use another location and name.
In that case, be sure to supply the location of the config file when initializing the API.

You can initialize the API with the static ```Api.getApi()``` method:

```typescript
import {Api} from "wot-big-iot";

Api.getApi().then((api: Api) => {
    // Your code here
};
```

If you want to provide a specific config file, pass it as parameter of the ```getApi()``` method:

```typescript
Api.getApi("./path/relative/to/api/location").then((api: Api) => {
    // Your code here
};
```

Code samples using the API are available in the ```examples``` sub directory.

## Api signatures

- ```static getApi(string?): Promise<Api>```:

Used to retrieve an instance of the Api object. This is the only way to get an instance, since the API needs to read its configuration (asynchronously) before use.
- ```convertThings(string[]): Promise<void>```:

Convert an array of TDs to a set of offerings, setting up or updating the Gateway and creating the ODs. Does not include registration of offerings on the marketplace, but instead saves the ODs put them in a "to register" list. Asynchronous operation.
- ```convertThingsFromUris(string[]): Promise<void>```:

Fetches TDs based on HTTP, HTTPS, COAP, COAPS or local URI and calls ```convertThings``` once all TDs have been retrieved. Asynchronous operation.
- ```getOfferingsToRegister(): bigiot.offering[]```:

Retrieve the list of all ODs waiting for registration in the "to register" list.
- ```getRegisteredOfferings(): bigiot.offering[]```:

Retrieve the list of all ODs already registered on the marketplace in this session.
- ```registerOfferings(string[]): Promise<void>```:

Register pending offerings to the marketplace based on a list of names to register. Asynchronous operation.
- ```registerAllOfferings(): Promise<void>```:

Register all pending offerings to the marketplace. Asynchronous operation.
- ```deleteOfferings(string[]): Promise<void>```:

Delete registered offerings from the marketplace based on a list of names to delete. Asynchronous operation.
- ```deleteAllOfferings(): Promise<void>```:

Delete all already registered offerings from the marketplace. Asynchronous operation.
- ```convertOfferings(string[]): Promise<WoT.Thing[]>```:

Convert a set of offerings to one or more Things, based on provided identifiers (used to retrieve ODs from the marketplace). The used strategy is defined in configuration. Asynchronous operation.
- ```getSemanticTypeSuggestion(string): Promise<SearchResult[]>```:

Call the SemanticSearcher component to get a set of suggestions for a semantic type based on a variable name. Asynchronous operation.
- ```getProviderId(): string```:

Get the id of the currently used bigiot provider object.
- ```getConsumer(): bigiot.consumer```:

Get the currently used bigiot consumer object.

## Command Line Interface

A command line interface is also available to use the API without creating your own application. The CLI is available in the ```clients``` sub directory.

The following commands can be used:

- ```convert_things```:

Convert a list of Things based on the list of their URIs. Supports http://, coap:// and local (on disk) URIs.
- ```show_offerings_to_register```:

Show the list of offerings created with conversion in this session, and waiting to be registered. Only names are displayed.
- ```show_registered_offerings```:

Show offerings already registered in this session. Only names are displayed.
- ```register_all_offerings```:

Register all offerings currently waiting for registration on the marketplace.
- ```delete_all_offerings```:

Delete all offerings currently registered on the marketplace for this session.
- ```convert_offerings```:

Convert a list of Offerings based on the list of their identifiers on the marketplace. The resulting Thing(s) are then saved on a local file for future reuse.