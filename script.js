document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("preview");
  const detectButton = document.getElementById("detectButton");
  const detectedObjectsDiv = document.getElementById("detectedObjects");

  let uploadedImage = null;

  // Display the uploaded image in the preview box
  imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        uploadedImage = file;
        preview.innerHTML = `<img src="${reader.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    }
  });

  // Send the image to the backend for detection
  detectButton.addEventListener("click", async () => {
    if (!uploadedImage) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", uploadedImage);

    try {
      const response = await fetch("http://localhost:5000/detect", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to detect objects.");
      }

      const data = await response.json();
      displayDetectedObjects(data.objects);
    } catch (error) {
      console.error(error);
      alert("An error occurred during object detection.");
    }
  });

  // Display the detected objects in the UI
  function displayDetectedObjects(objects) {
    detectedObjectsDiv.innerHTML = `<h2>Detected Objects:</h2>`;
    if (objects.length === 0) {
      detectedObjectsDiv.innerHTML += `<p>No objects detected.</p>`;
      return;
    }
    const list = document.createElement("ul");
    objects.forEach((obj) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${obj.name} (${obj.confidence}%)`;
      list.appendChild(listItem);
    });
    detectedObjectsDiv.appendChild(list);
  }
});
