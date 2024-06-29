const Category = require("../models/Category");

//create category
exports.createNewCategory = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Enter all the required fields",
      });
    }

    //create entry in dB
    const categoryDetails = await Category.create({
      name: name,
      description: description
    });

    console.log(categoryDetails);

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in creating a new category",
    });
  }
};

//get all category
exports.showAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      allCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

//category page details
//show other recommended categories as well
exports.categoryPageDetails = async (req, res) => {
  try {
    //get category id
    const { categoryId } = req.body;
    //fetch all courses for specified category id
    const selectedCategory = await Category.findById(categoryId)
      .populate("course")
      .exec();

    //validation
    if (!selectedCategory) {
      return res.json({
        success: false,
        message: "Data not found",
      });
    }
    //show all different category courses
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
    .populate("course")
    .exec();

    //get top 10 SellingCourse

    //return response
    return res.json({
        success:true,
        data:{
            selectedCategory,
            differentCategories,
        }
    })
  } catch (error) {
        console.log(error);
        return res.json({
            success:false,
            message:error.message,
        })
  }
};
