import Post from '../models/postModel.js'

// Sample posts data
const samplePosts = [
  {
    title: 'রক্তদান করুন, জীবন বাঁচান',
    content: 'রক্তদান একটি মহৎ কাজ। এক ব্যাগ রক্ত একজন মানুষের জীবন বাঁচাতে পারে। আপনার নিকটস্থ রক্তদান কেন্দ্রে যোগাযোগ করুন।',
    category: 'blood-donation',
    author: 'Admin',
    image: '',
    link: '',
    isActive: true,
    views: 0
  },
  {
    title: 'স্বাস্থ্য সচেতনতা: নিয়মিত ব্যায়াম করুন',
    content: 'নিয়মিত ব্যায়াম আপনার স্বাস্থ্যের জন্য অত্যন্ত গুরুত্বপূর্ণ। প্রতিদিন কমপক্ষে ৩০ মিনিট ব্যায়াম করুন।',
    category: 'health',
    author: 'Admin',
    image: '',
    link: '',
    isActive: true,
    views: 0
  },
  {
    title: 'স্বেচ্ছাসেবী হয়ে গড়ে তুলুন সমাজ',
    content: 'স্বেচ্ছাসেবী কাজে অংশগ্রহণ করুন। আপনার সময় এবং শক্তি দিয়ে অন্যের সাহায্য করুন।',
    category: 'volunteering',
    author: 'Admin',
    image: '',
    link: '',
    isActive: true,
    views: 0
  },
  {
    title: 'জরুরি স্বাস্থ্য পরামর্শ',
    content: 'জরুরি স্বাস্থ্য সমস্যায় ৯৯৯ নম্বরে কল করুন। আমাদের বিশেষজ্ঞ ডাক্তাররা আপনার সাহায্য করবেন।',
    category: 'emergency',
    author: 'Admin',
    image: '',
    link: '',
    isActive: true,
    views: 0
  },
  {
    title: 'নিয়মিত স্বাস্থ্য পরীক্ষা করুন',
    content: 'প্রতিবছর নিয়মিত স্বাস্থ্য পরীক্ষা করুন। প্রাথমিক অবস্থায় রোগ শনাক্ত করা গেলে চিকিৎসা সহজ হয়।',
    category: 'health',
    author: 'Admin',
    image: '',
    link: '',
    views: 0
  },
  {
    title: 'সামাজিক স্বাস্থ্য সচেতনতা',
    content: 'সমাজের সবাইকে স্বাস্থ্য সচেতন করতে সাহায্য করুন। আপনার পরিবারের সদস্য এবং প্রতিবেশীদের সাথে স্বাস্থ্য বিষয় নিয়ে আলোচনা করুন।',
    category: 'general',
    author: 'Admin',
    image: '',
    link: '',
    isActive: true,
    views: 0
  }
]

export async function getAllPosts(req, res) {
  try {
    const skipDb = process.env.SKIP_DB === 'true'
    let posts = []

    if (!skipDb) {
      try {
        posts = await Post.find({ isActive: true })
          .sort({ createdAt: -1 })
          .limit(50)
      } catch (dbError) {
        console.error('DB error in getAllPosts:', dbError)
      }
    }

    if (posts.length === 0) {
      posts = samplePosts
    }

    res.json({ ok: true, posts })
  } catch (error) {
    console.error('Error in getAllPosts:', error)
    res.status(500).json({ ok: false, message: error.message, posts: samplePosts })
  }
}

export async function getPostById(req, res) {
  try {
    const { id } = req.params
    const skipDb = process.env.SKIP_DB === 'true'
    let post = null

    if (!skipDb) {
      try {
        post = await Post.findById(id)
        if (post) {
          post.views = (post.views || 0) + 1
          await post.save()
        }
      } catch (dbError) {
        console.error('DB error in getPostById:', dbError)
      }
    }

    if (!post) {
      post = samplePosts.find(p => p._id?.toString() === id || Math.random() > 0.5)
    }

    if (!post) {
      return res.status(404).json({ ok: false, message: 'Post not found' })
    }

    res.json({ ok: true, post })
  } catch (error) {
    console.error('Error in getPostById:', error)
    res.status(500).json({ ok: false, message: error.message })
  }
}

export async function getPostsByCategory(req, res) {
  try {
    const { category } = req.params
    const skipDb = process.env.SKIP_DB === 'true'
    let posts = []

    if (!skipDb) {
      try {
        posts = await Post.find({ category, isActive: true })
          .sort({ createdAt: -1 })
          .limit(50)
      } catch (dbError) {
        console.error('DB error in getPostsByCategory:', dbError)
      }
    }

    if (posts.length === 0) {
      posts = samplePosts.filter(p => p.category === category)
    }

    res.json({ ok: true, posts })
  } catch (error) {
    console.error('Error in getPostsByCategory:', error)
    res.status(500).json({ ok: false, message: error.message, posts: [] })
  }
}

export async function createPost(req, res) {
  try {
    const { title, content, category, author, image, link } = req.body

    if (!title || !content || !category) {
      return res.status(400).json({ ok: false, message: 'Title, content, and category are required' })
    }

    const skipDb = process.env.SKIP_DB === 'true'

    if (skipDb) {
      return res.json({ ok: true, post: { ...req.body, _id: Date.now().toString(), createdAt: new Date() } })
    }

    const post = new Post({
      title,
      content,
      category,
      author: author || 'Admin',
      image: image || '',
      link: link || '',
      isActive: true
    })

    await post.save()
    res.status(201).json({ ok: true, post })
  } catch (error) {
    console.error('Error in createPost:', error)
    res.status(500).json({ ok: false, message: error.message })
  }
}

