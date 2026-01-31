function buildVehicleDetailHTML(vehicle) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(vehicle.inv_price)

  const miles = new Intl.NumberFormat("en-US").format(vehicle.inv_miles)

  return `
    <section class="vehicle-detail">
      <div class="vehicle-detail__image">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" />
      </div>

      <div class="vehicle-detail__content">
        <h2 class="vehicle-detail__title">${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

        <p class="vehicle-detail__price"><strong>Price:</strong> ${price}</p>
        <p class="vehicle-detail__miles"><strong>Mileage:</strong> ${miles} miles</p>

        <h3>Description</h3>
        <p>${vehicle.inv_description}</p>

        <ul class="vehicle-detail__meta">
          <li><strong>Color:</strong> ${vehicle.inv_color ?? "N/A"}</li>
        </ul>
      </div>
    </section>
  `
}

module.exports = {
  // ...existing exports
  buildVehicleDetailHTML,
}
