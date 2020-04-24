# GTFS-ride Tools Development
Web-based tools for the management of GTFS-ride data.

#### Authors:
- **Name :: Email :: GitHub Username**
- Chase Stubblefield :: stubblec@oregonstate.edu :: @chasestubb
- Winston Pingnomo :: pingnomw@oregonstate.edu :: @pingnomw
- Ashley Vieira :: vieiraas@oregonstate.edu :: @AshleyVieira

### To Demo Our Tools (For Both Non-Technical and Technical Users):
We are currently hosting our code at http://138.197.202.242:3000/ --You can simply paste this link into your web browser (Chrome/etc.) to interact with the tools we have built. Keep in mind that this may not be the most recent state of the code--that will be here on GitHub. We will be updating this hosted code to reflect major developments.

### Testing the Interface
Our two main functions are "**Info**" and "**Feed Creation**." Ultimately, what all of our tools do is manipulative GTFS and GTFS-ride feeds, which are zipped folders of .txt files that are really .csv files. The majority of all development has been on the underlying infrastructure of the project, understanding the feed specifications, and deepening the functionalities of Feed Creation and Info.

##### To Test "Feed Creation"
1. Choose "Test Feed Creation" in the lefthand sidebar.
2. Adjust fields as desired. Note that someone who typically uses this product will be non-technical, but will have familiarity with transit agencies. Generally, # agencies < # routes < # stops, but the bounds for each of these values should be well managed to support nearly anything. The ridership features are still in development, so these fields do not matter. 
3. For "Service pattern defined in:", make sure you choose "Both files (recommended)". This is the predominantly used case, and it is currently the only one we support.

##### To Test "Info"
We will be able to use the feed we just created with Feed Creation to test Info as well. To do this, head back to "Home" in the lefthand sidebar and upload the zip folder you just created (`fc.zip`). Then, you will be able to go to "Info" and see the feed's contents displayed. Within this, some elements, such as listed agencies (`Test Transit#`, for example), will be able to be clicked to see information specific to that agency. You will also be able to click a route and see relevant information for that route.

---
### (Not recommended) Instructions for Technical User:
We do not recommend this option first because our server has been built for Linux/UNIX and experiences some issues with Windows which handles file IO very differently. This is not an issue because from the beginning we have known that our end goal is a Linux/UNIX server. Please also note that we handle Windows *clients* just fine. And second, we do not recommend this option since it is really just trivial npm and git cloning.

1. Clone the repo (`git clone [URL]`)
2. Within the `/frontend` folder, run `npm install`, then run `npm start`. There is a chance you may experience a few warnings. Do not be bothered by these--they only affect development (not production) and they are for a package that is unused. We are also looking to resolve this warning.
3. Open a new terminal window and within the `/backend` folder, run `npm install`, then run `node filehandler.js`
4. Go to http://localhost:3000/ (will probably open automatically) to interact with the interface.

#### To Run our Unit Tests:
We are using the mocha and chai javascript libraries.

To run our tests, go to the `/backend` folder and run `npm run test`.


