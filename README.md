**VR Public Speaking Tool: StageCraft**

StageCraft is a VR Public Speaking Practice Tool designed to enhance public speaking skills by simulating realistic environments like auditoriums and conference rooms. Users can participate as speakers or audience members, receiving real-time feedback and ratings to refine their skills. The project utilizes Three.js for 3D rendering and Node.js for backend functionality.

Youtube link : https://youtu.be/MooMizoUTRE<br />
Website link : https://vr-public-speaking.vercel.app/

Website preview:
![image](https://github.com/user-attachments/assets/642b5128-7e06-41d3-b84e-31e20198471b)
![image](https://github.com/user-attachments/assets/d1bc8043-3f9c-4934-b857-11ea6ae3dfda)

**Features:**

3D Avatar Representation and Interaction

    Real-time loading, animation, and interaction with 3D avatars using Three.js.
    Speakers are represented by customizable 3D avatars.
    Spectators choose avatars during entry, which are displayed alongside their names in the participant list.

Real-Time Feedback Collection

    Spectators can provide feedback on speakers' performance through an interactive rating system.
    Ratings cover multiple aspects of the session, and aggregated feedback is visualized using charts for better insights.

Audio Session Simulation

    Support for audio file uploads, enabling simulation of speaking sessions with synchronized avatar animations.
    Real-time audio streaming for live speaking engagements.

Participant List Management

    A dynamic list of all participants (speakers and spectators) with their respective avatars and chosen names.

Socket Communication

    Seamless real-time updates for:
        Feedback submission and visualization.
        Screen sharing and audio streaming between speakers and spectators.

Responsive Design

    A fully optimized and responsive user interface, ensuring a smooth experience across devices.

_________________________________________________________________________________________________________________________________

**index.html**

    Overview: 
        This HTML file sets up the homepage for the StageCraft web application. It includes a navigation bar, a background slide         with a welcome message, and a spectator dialog for users to join as spectators, select an avatar, and enter their name.

    HTML Structure:

    Head Section:
        Character Encoding: UTF-8 for compatibility.
        Title: Page title set to StageCraft.
        Icon: A logo image is set as the favicon.
        Viewport: Responsive design using width=device-width.

    Body Section:
        Logo Bar: Fixed navigation bar with a logo and links.
        Slide Section: Full-screen background slide with a welcome message and buttons.
        Spectator Dialog: Hidden modal for spectators to enter their name and choose an avatar.

Styles:

    Global Styles: Sets margins, padding, and height for full-page layout.
    Navbar Styles: Fixed navbar with background color, logo, and links.
    Slide Styles: Full-screen background image with text content.
    Button Styles: Custom button design with hover effects.
    Dialog Styles: Modal dialog for spectator details with avatar selection.

JavaScript Functions:

    joinAsSpeaker(): Redirects to the speaker page.
    openSpectatorDialog(): Displays the dialog for spectators to enter details.
    closeSpectatorDialog(): Closes the dialog and clears inputs.
    selectAvatar(avatar): Sets the selected avatar and highlights the option.
    submitSpectatorDetails(): Validates input and stores spectator data in sessionStorage, then redirects to the home page.

_________________________________________________________________________________________________________________________________

**home.html**

    Overview:
        Provides an interactive platform for managing participants and spectator activities in a virtual StageCraft session.             Includes features for 3D avatar loading, participant rating, and session feedback with a focus on Three.js-based visual          interactivity.
Head Section

    Meta and Styling:
        Defines character encoding and responsive viewport settings.
        Links external stylesheets and fonts for a polished interface.

    Font and Icons:
        Preconnects to Google Fonts and links the "Inter" font family.
        Adds a favicon (logo.png) for branding.

    Script Imports:
        Configures import maps to include Three.js and its addons for 3D scene management.
        Loads additional scripts (avatar.js, feedback.js, participants.js) for functionality.

Body Structure

    Sidebar:
        Participants Section: Displays a dynamic list of participants with avatar icons.
        Feedback Section:
            Allows users to rate the speaker based on confidence, fluency, and subject.
            Uses buttons mapped to data attributes for feedback input.
        Graph Section:
            Displays a feedback summary chart using Chart.js.
        Exit Room: Provides a button to clear session storage and redirect users.

    Main Content:
        Avatar Container: Hosts the 3D avatar loaded using Three.js.
        Audio Upload: Accepts user-uploaded audio for potential avatar lip-syncing.
        Reset Button: Resets the avatar's position in the scene.

Scripts and Features

    Three.js Functionalities:
        Loads and animates a 3D avatar using modules like GLTFLoader.
        Integrates with avatar.js for managing animations and interactions.

    Feedback Chart:
        Renders real-time feedback summaries via Chart.js.

    Interaction and Navigation:
        Handles spectator session data (name, avatar) using session storage.
        Redirects users to the index page upon exiting the session.

_________________________________________________________________________________________________________________________________

**avatar.js**

    Overview: Manages the loading, animation, and interaction with the 3D avatar of the speaker using Three.js.

Head Section:

    Three.js Imports:
        Import Three.js core library (three.js).
        Import necessary loaders (e.g., GLTFLoader) for loading 3D avatar models.
        Import animation-related modules for smooth character movement.

Body Structure:

    Avatar Container:
        Creates a 3D scene where the avatar is loaded, animated, and positioned.
    Avatar Animation:
        Implements functionality for animating the avatar, such as lip-syncing with audio or simple gestures.
        Uses the animation system from Three.js to apply predefined animations or custom ones based on user input.
    Avatar Interaction:
        Responds to user interactions (such as mouse clicks or dragging the avatar) to simulate actions like nodding or shaking the head.
        Incorporates user interaction logic using Raycaster for detecting mouse clicks in the scene.

Imports:

    Three.js Core, GLTFLoader, AnimationMixer, and other helper modules from Three.js.

_________________________________________________________________________________________________________________________________

**feedback.js**

    Overview: Handles the feedback system, collecting ratings from spectators and visualizing the data with charts.

Head Section:

    Chart.js Imports:
        Import Chart.js for rendering the feedback charts based on user input.
        Import Socket.io for real-time feedback updates.

Body Structure:

    Rating Collection:
        Collects ratings for the speaker’s performance on aspects like Confidence, Fluency, and Subject Knowledge.
        Uses button elements for score selection (1-5).
        Upon rating submission, the data is transmitted via Socket.io to the server.
    Feedback Summary:
        Displays visual summaries (such as bar or pie charts) of the feedback on a canvas element using Chart.js.
        Dynamically updates the charts as new feedback is received.
    Socket Communication:
        Real-time data exchange for updating the charts with live feedback.

Imports:

    Chart.js, Socket.io-client, and any additional libraries for handling form inputs or DOM updates.

_________________________________________________________________________________________________________________________________

**participants.js:**

Overview: Manages the participants' list, displaying spectators with their chosen avatars.

Head Section:

    Socket.io Imports:
        Import Socket.io for real-time communication to fetch participant data and update the list.
        Import relevant utility functions to manage dynamic DOM updates.

Body Structure:

    Participants List:
        Dynamically generates a list of spectators who are joining the session.
        Each spectator's name and chosen avatar are displayed in a list or grid format.
    Avatar Display:
        Each participant is associated with a 3D avatar which can be selected by the spectator.
        The chosen avatar is then rendered in the 3D scene.
    Socket Communication:
        Updates the participants list in real-time as new spectators join the session.
        Listens for new participant events and updates the DOM with their avatar and name.

Imports:

    Socket.io-client for managing real-time communication, and any helper libraries to dynamically update the participant list.

_________________________________________________________________________________________________________________________________

**server.js:**

Overview: 

    server.js sets up an Express server with Socket.io for real-time communication in StageCraft, handling client connections, f     feedback, screen sharing, and audio sharing.

Server Setup:

    Dependencies: express, http, socket.io
    Server Creation: An Express app is wrapped in an HTTP server and connected to Socket.io.

Socket.io Event Handlers:

    Client Connection: Logs the client’s socket ID when a client connects.
    Screen Sharing: Broadcasts screen share data to all clients except the sender.
    Feedback Updates: Receives feedback data and broadcasts it to other clients.
    Audio Sharing: Broadcasts audio data to all clients except the sender.
    Client Disconnection: Logs client disconnections and updates the count of connected clients.

_________________________________________________________________________________________________________________________________

Contributors: 

Megha JS : https://github.com/megg003<br />
    
Varsha JS : https://github.com/varshajs

