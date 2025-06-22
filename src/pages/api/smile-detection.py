# for filename in os.listdir(image_folder): # type: ignore
#     if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
#         try:
#             image_path = os.path.join(image_folder, filename) # type: ignore
#             img = Image.open(image_path).convert('RGB')  # type: ignore # Force RGB
            
#             input_tensor = transform(img).unsqueeze(0) # type: ignore

#             output = model(input_tensor) # type: ignore
#             _, predicted_class = output.max(1)
#             print(f"{filename}: Predicted class {predicted_class.item()}")

#         except Exception as e:
#             print(f"Skipping {filename} due to error: {e}")
