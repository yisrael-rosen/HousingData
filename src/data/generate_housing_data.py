import json
import random

def generate_housing_data():
    data = []
    base_marketed = 35000  # Starting point for marketed
    base_planned = 2000    # Starting point for planned
    base_submitted = 3000  # Starting point for submitted (between planned and marketed)
    
    # Growth rates
    marketing_growth_2025_2030 = 0.12  # 12% growth in marketing 2025-2030
    marketing_growth_2030_2040 = 0.06  # 6% growth in marketing 2030-2040
    planning_growth_2030_2040 = 0.15   # 15% growth in planning 2030-2040
    
    for year in range(2025, 2041):
        # Calculate required based on linear growth to 250,000 by 2040
        required = 67273 + ((250000 - 67273) / 15) * (year - 2025)
        
        # Calculate required based on linear growth to 250,000 by 2040
        required = 67273 + ((250000 - 67273) / 15) * (year - 2025)
        
        # Calculate initial values
        if year <= 2030:
            marketed = base_marketed * (1 + marketing_growth_2025_2030) ** (year - 2025)
            planned = base_planned * (1 + 0.08) ** (year - 2025)
        else:
            marketed = base_marketed * (1 + marketing_growth_2025_2030) ** 5 * \
                      (1 + marketing_growth_2030_2040) ** (year - 2030)
            planned = base_planned * (1 + planning_growth_2030_2040) ** (year - 2030)
            
        # Calculate submitted as a proportion between planned and marketed
        submitted = planned + (marketed - planned) * 0.3
        
        # Adjust values if total exceeds required
        total = marketed + submitted + planned
        if total > required:
            scale_factor = required / total
            marketed = int(marketed * scale_factor)
            submitted = int(submitted * scale_factor)
            planned = int(planned * scale_factor)
        
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
