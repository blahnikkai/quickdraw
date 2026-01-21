# Quickdraw

## To run
1. Run backend with  
`npx tsx server/server`
2. Run frontend with  
`npm start`

## To build for distribution
Compile backend from server/
`npx tsc`

## To upload built files for deployment
Run the below command to upload files to an AWS S3 bucket
`source aws-upload-script.sh`

## Network Architecture Explanation
import.meta.env.VITE_BACKEND_URL is an environment variable  
### Locally
Set by .env 
### Prod - In Vercel settings

Set to the DNS address provided by noip.com.  

noip.com allows me to set the DNS mapping from a hostname to IP address.

IP address is the elastic IP provided by AWS linked to the EC2 instance.  

### nginx
On the EC2 instance, nginx reverse proxies requests to port 3001, where the application server runs.  
Config at `/etc/nginx/conf.d/myapp.conf`

### pm2
Server process running with pm2
`pm2 list`
`pm2 describe quickdraw`

Something like
pm2 start server.js --name quickdraw
