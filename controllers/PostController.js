import PostModel from '../models/post.js';

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map((obj) => obj.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to get tags',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate('user')
            .sort({ createdAt: -1 })
            .exec();

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to get all articles',
        });
    }
};
export const getPopular = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate('user')
            .sort({ viewsCount: -1 })
            .exec();

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to get all articles',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' }
        ).populate('user');

        if (!doc) {
            return res.status(404).json({
                message: 'Article not found',
            });
        }

        res.json(doc);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to get article',
        });
    }
};
export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findByIdAndDelete({
            _id: postId,
        });

        if (!doc) {
            res.status(500).json({
                message: 'Article not found',
            });
        }

        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to remove article',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to create article',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                user: req.userId,
            }
        );
        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to update article',
        });
    }
};
