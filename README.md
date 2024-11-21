VR Public Speaking Tool: StageCraft

StageCraft is a VR Public Speaking Practice Tool designed to enhance public speaking skills by simulating realistic environments like auditoriums and conference rooms. Users can participate as speakers or audience members, receiving real-time feedback and ratings to refine their skills. The project utilizes Three.js for 3D rendering and Node.js for backend functionality.

Youtube link : https://youtu.be/2Joq2B4CEkM<br />
Website link: https://avatar-spectator.vercel.app/

Website preview:
![Screenshot 2024-11-19 110230](https://github.com/user-attachments/assets/dec9cef2-617c-4173-846f-08de3b47e55e)


index.html

    Overview: Represents the StageCraft web application for user feedback on speakers.
    Head Section:
        Includes metadata (UTF-8 encoding, responsive viewport).
        Links to external CSS and Google Fonts.
        Defines an import map for Three.js and imports avatar.js.
    Body Structure:
        Sidebar: Users rate the speaker on Confidence, Fluency, and Subject using buttons (scores 1-5).
        Feedback Summary: Displays charts on a canvas.
        Main Content: Contains an avatar container, loading message, audio upload input, and reset button.
        Links to Chart.js for charting and Socket.io for real-time communication, along with feedback.js.


avatar.js

    Purpose: Utilizes Three.js to create a 3D avatar animated by audio input and user interactions.
    Key Functions:
        loadModel: Loads the avatar model and sets up the scene.
        setupScene: Configures renderer, camera, and lighting; identifies avatar bones for animation.
        startRecording/stopRecording: Manages audio recording and playback.
        resetToAttentionPosition: Resets avatar pose post-playback.
    Animation: Triggered by the 'T' key; syncs jaw movement to audio amplitude using AudioAnalyser.
    Real-Time Communication: Uses socket connection to emit audio data.


feedback.js

    Functionality: Captures user ratings for speaker performance in Confidence, Fluency, and Subject.
    Initialization:
        Waits for DOM to load; establishes socket connection.
        Initializes feedbackData object and a Chart.js pie chart.
    User Interaction: Updates ratings on button clicks; refreshes the chart and emits data to the server.
    Real-Time Updates: Listens for server feedback updates to synchronize the chart.


Contributors: 
    
    Megha JS : [https://github.com/megg003 ](url)
    Varsha JS : 

