const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    ]
      })
      res.json(categoryData);
  } catch (error) {
    res.status(500).json({ error })
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{
        model: Product,
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      },
    ]
    })
    res.json(categoryData);
  } catch (error) {
    res.status(500).json({ error })
  }
});

router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      "category_name": "Basketball"
    }
  */
  Category.create(req.body)
  .then((product) => {
    res.status(200).json(product);
  })
  .catch((err) => {
    console.error(err);
    res.status(400).json(err);
  });
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!categoryData[0]) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.findByPk(req.params.id);

    if (!categoryData) {
      res.status(404).json({ message: 'No Category found with this id!' });
      return;
    }

    // Disassociate the products from the deleted category
    await Product.update(
      { category_id: null },
      { where: { category_id: req.params.id } }
    );

    // Delete the category now that the associations are gone
    await Category.destroy({
      where: {
        id: req.params.id
      }
    })

    res.status(200).json("Category was successfully deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
