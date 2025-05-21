# WebAudioTranscriber

A web application for transcribing audio files using local processing. This application was developed by Shreenidhi Vasishta and allows users to upload audio files, transcribe them, and download the transcriptions in various formats.

## Features

- Audio file upload and transcription using local processing
- Real-time transcription progress tracking
- Download transcriptions in various formats (Text, DOCX, PDF)
- User-friendly interface with modern UI components
- Responsive design for mobile and desktop use

## Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn/UI
- **Backend**: Express.js, Node.js
- **Database**: NeonDB (PostgreSQL)
- **Transcription**: Local Processing (Python)
- **Authentication**: Passport.js
- **Deployment**: Render

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Python 3.6+ (for the transcription script)
- NeonDB connection string

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/shreenidhivasishta/WebAudioTranscriber.git
   cd WebAudioTranscriber
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_neondb_connection_string
   SESSION_SECRET=your_session_secret
   ```

4. Run database migrations:
   ```
   npm run db:push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Access the application at `http://localhost:5000`

## Building for Production

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## Deployment to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:
   - **Name**: WebAudioTranscriber (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose appropriate plan (Free tier works for testing)

4. Add the following environment variables in Render:
   - `DATABASE_URL` (Your NeonDB connection string)
   - `SESSION_SECRET` (A secure random string)
   - `NODE_ENV` = production

5. Deploy your application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## About the Author

Developed by **Shreenidhi Vasishta**.

## Acknowledgements

- [Shadcn/UI](https://ui.shadcn.com/) for UI components
- [TailwindCSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) for the frontend framework
- [Express](https://expressjs.com/) for the backend framework 