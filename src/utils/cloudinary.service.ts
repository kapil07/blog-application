import { deleteFromCloudinary, uploadToCloudinary } from "./cloudinary.helper";
import { IFileService } from "./file.interface";

export class cloudinaryService implements IFileService {
  async upload(filePath: string): Promise<string> {
    return (await uploadToCloudinary(filePath)) as string;
  }

  async delete(fileUrl: string): Promise<void> {
    await deleteFromCloudinary(fileUrl);
  }
}
