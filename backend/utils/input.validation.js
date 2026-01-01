const z = require("zod");

module.exports.loginSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required." }) // Ensure the input is not empty
        .email({ message: "Invalid email format." })
        .max(100, { message: "Email is too long." }),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(100, { message: "Password is too long." })
});

module.exports.changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters")
});

module.exports.deleteAccountSchema = z.object({
    password: z.string().min(1, "Password is required")
});

module.exports.onlyEmailSchema = z.object({
    email: z.string().email("Invalid email format")
});

module.exports.createProjectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional()
});

// Create Collection Schema
module.exports.createCollectionSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    collectionName: z.string().min(1, "Collection Name is required"),
    schema: z.array(z.object({
        key: z.string(),
        type: z.enum(['String', 'Number', 'Boolean', 'Date']),
        required: z.boolean().optional()
    })).optional()
});

module.exports.sanitize = (obj) => {
    const clean = {};
    for (const key in obj) {
        if (!key.startsWith('$')) {
            clean[key] = obj[key];
        }
    }
    return clean;
};