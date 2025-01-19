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
    
    # Starting total is about 40% of initial required
    initial_total_ratio = 0.4
    
    for year in range(2025, 2041):
        # Calculate required based on exponential growth to 250,000 by 2040
        growth_rate = (250000/67273)**(1/15) - 1  # Calculate required growth rate
        required = 67273 * (1 + growth_rate)**(year - 2025)
        
        # Calculate exponential growth curve
        years_passed = year - 2025
        progress = years_passed / 15
        
        # Calculate target percentages that ensure cumulative sum stays under required
        # Max percentages: marketed 35%, submitted 15%, planned 8% (total 58%)
        max_marketed_pct = 0.35
        max_submitted_pct = 0.15
        max_planned_pct = 0.08
        
        # Use exponential growth to reach these percentages
        growth_factor = progress ** 0.5  # Creates curved growth
        marketed_pct = 0.15 + (max_marketed_pct - 0.15) * growth_factor
        submitted_pct = 0.06 + (max_submitted_pct - 0.06) * growth_factor
        planned_pct = 0.03 + (max_planned_pct - 0.03) * growth_factor
        
        # Calculate units based on percentages of required target
        marketed = required * marketed_pct
        submitted = required * submitted_pct
        planned = required * planned_pct
        
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
