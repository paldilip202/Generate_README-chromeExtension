document.getElementById('readme-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const projectName = document.getElementById('projectName').value.trim();
    const description = document.getElementById('description').value.trim();
    const version = document.getElementById('version').value.trim();
    const author = document.getElementById('author').value.trim();
    const features = document.getElementById('features').value.trim();
    const installation = document.getElementById('installation').value.trim();
    const usage = document.getElementById('usage').value.trim();
    const contributing = document.getElementById('contributing').value.trim();
    const acknowledgements = document.getElementById('acknowledgements').value.trim();
    const license = document.getElementById('license').value.trim();
    const tags = document.getElementById('tags').value.trim().split(',').map(tag => tag.trim()).filter(Boolean);
    const imageFile = document.getElementById('imageUpload').files[0];
    const videoFile = document.getElementById('videoUpload').files[0];
    const errorMessage = document.getElementById('error-message');

    if (!projectName) {
        errorMessage.textContent = 'Project Name is required.';
        return;
    }

    errorMessage.textContent = '';

    // Encode files to base64
    const encodeFile = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    Promise.all([
        imageFile ? encodeFile(imageFile) : Promise.resolve(null),
        videoFile ? encodeFile(videoFile) : Promise.resolve(null)
    ]).then(([imageDataUrl, videoDataUrl]) => {
        const readmeContent = generateReadme({
            projectName,
            description,
            version,
            author,
            features,
            installation,
            usage,
            contributing,
            acknowledgements,
            license,
            tags,
            imageDataUrl,
            videoDataUrl
        });

        // Download README file
        downloadReadme(readmeContent, `${projectName}.md`);
    }).catch((error) => {
        errorMessage.textContent = 'Error processing files.';
        console.error(error);
    });
});

function generateReadme(data) {
    let readmeContent = `# ${data.projectName}\n\n`;

    if (data.description) readmeContent += `## Description\n${data.description}\n\n`;
    if (data.version) readmeContent += `## Version\n${data.version}\n\n`;
    if (data.author) readmeContent += `## Author\n${data.author}\n\n`;
    if (data.features) readmeContent += `## Features\n${data.features}\n\n`;
    if (data.installation) readmeContent += `## Installation\n\`\`\`\n${data.installation}\n\`\`\`\n\n`;
    if (data.usage) readmeContent += `## Usage\n\`\`\`\n${data.usage}\n\`\`\`\n\n`;
    if (data.contributing) readmeContent += `## Contributing\n${data.contributing}\n\n`;
    if (data.acknowledgements) readmeContent += `## Acknowledgements\n${data.acknowledgements}\n\n`;
    if (data.license) readmeContent += `## License\n${data.license}\n\n`;
    if (data.tags.length) readmeContent += `## Tags\n${data.tags.join(', ')}\n\n`;
    if (data.imageDataUrl) readmeContent += `## Project Image\n![Project Image](${data.imageDataUrl})\n\n`;
    if (data.videoDataUrl) readmeContent += `## Project Video\n[![Project Video](${data.videoDataUrl})](data:video/mp4;base64,${data.videoDataUrl})\n\n`;

    return readmeContent;
}

function downloadReadme(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
