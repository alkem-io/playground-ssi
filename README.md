Goals:
- to be able to generate DIDs using the Jolocom method
- to store the DDO associated with the DID
- to be able to build the solution using the jolocom library as a managed dependency
- to have the code buildable out of Server.Identity repository
- ability to have a wallet that is managed by the identity
- understand what how to integrate wallets with the SSI
- understand where to persist the artifacts related to the SSI

Command line / code interface is fine i.e. no UI needed

1 week effort: time boxed

Scenario 1:
- login as a user
- retrieve the DID associated with that user account
- ask the ecoverse, as the controller for that DID, to sign a message on behalf of the user
- store a token into the wallet + show it is there


Dependencies
- Accounts for users to login / create new users?
- location to store DDOs?


Open points
- For now mockup the ecoverse identity / role
- Storage of DDO's?
- Leverage of EVM or not?


