import json
import random

def generate_housing_data():
    data = []
    base_marketed = 35000  # Starting point for marketed
    base_planned = 2000    # Starting point for planned
    base_submitted = 3000  # Starting point for submitted (between planned and marketed)
    
    # Initial proportions and growth rates
    marketed_ratio = 0.6  # 60% of total units
    submitted_ratio = 0.25  # 25% of total units
    planned_ratio = 0.15   # 15% of total units
    
    # Starting total is about 50% of initial required
    initial_total_ratio = 0.5
    
    for year in range(2025, 2041):
        # Calculate required based on exponential growth to 250,000 by 2040
        growth_rate = (250000/67273)**(1/15) - 1  # Calculate required growth rate
        required = 67273 * (1 + growth_rate)**(year - 2025)
        
        # Calculate total units ratio that grows from 50% to 85% over time
        years_passed = year - 2025
        total_ratio = initial_total_ratio + (0.85 - initial_total_ratio) * (years_passed / 15)
        
        # Calculate total units as growing percentage of required
        total_units = required * total_ratio
        
        # Distribute units according to ratios with slight adjustments over time
        time_factor = years_passed / 15  # Goes from 0 to 1
        # Gradually increase marketed ratio and decrease others
        current_marketed_ratio = marketed_ratio + (0.7 - marketed_ratio) * time_factor
        current_submitted_ratio = submitted_ratio - (submitted_ratio - 0.2) * time_factor
        current_planned_ratio = planned_ratio - (planned_ratio - 0.1) * time_factor
        
        marketed = total_units * current_marketed_ratio
        submitted = total_units * current_submitted_ratio
        planned = total_units * current_planned_ratio
        
        # Built units are based on previous year's marketed, starting lower
        built = marketed * 0.8 if year == 2025 else data[-1]["marketed"] * 0.85
        
        # Round all values to integers
        year_data = {
            "year": year,
            "marketed": int(marketed),
            "submitted": int(submitted),
            "planned": int(planned),
            "built": int(built),
            "required": int(required)
        }
        
        data.append(year_data)
    
    return {"data": data}

# Generate and save the data
housing_data = generate_housing_data()

with open('housingData2025-2040.json', 'w', encoding='utf-8') as f:
    json.dump(housing_data, f, indent=2)

print("Generated new housing data successfully!")
