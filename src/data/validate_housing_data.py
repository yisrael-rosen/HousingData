import json
import sys

def validate_housing_data(file_path):
    try:
        # Read and parse JSON
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not isinstance(data, dict) or 'data' not in data:
            print("❌ Error: Invalid JSON structure - missing 'data' key")
            return False
            
        years_data = data['data']
        if not isinstance(years_data, list) or not years_data:
            print("❌ Error: 'data' must be a non-empty array")
            return False
            
        # Validate each year's data
        prev_marketed = 0
        for entry in years_data:
            # Check required fields
            required_fields = ['year', 'marketed', 'submitted', 'planned', 'built', 'required']
            if not all(field in entry for field in required_fields):
                print(f"❌ Error: Missing required fields in year {entry.get('year', 'unknown')}")
                return False
                
            # Validate relationships
            if not (entry['planned'] <= entry['submitted'] <= entry['marketed']):
                print(f"❌ Error: Invalid status progression in year {entry['year']}")
                print(f"Planned: {entry['planned']}, Submitted: {entry['submitted']}, Marketed: {entry['marketed']}")
                return False
                
            # Validate built units (should be less than marketed)
            if entry['built'] > entry['marketed']:
                print(f"❌ Error: Built units exceed marketed units in year {entry['year']}")
                return False
                
            # Check growth patterns
            if prev_marketed > 0:
                growth = (entry['marketed'] - prev_marketed) / prev_marketed
                if entry['year'] <= 2030 and growth < 0:
                    print(f"❌ Warning: Negative marketing growth in 2025-2030 period: {entry['year']}")
                    
            # Validate that no component exceeds the required target
            required = entry['required']
            components = {
                'marketed': entry['marketed'],
                'submitted': entry['submitted'],
                'planned': entry['planned']
            }
            
            # Check each component individually
            for component_name, component_value in components.items():
                if component_value > required:
                    print(f"❌ Error: {component_name} units ({component_value:,}) exceed required target ({required:,}) in year {entry['year']}")
                    return False
            
            # Validate total units against required target for each year
            total_units = sum(components.values())
            if total_units > required:
                print(f"❌ Error: Total units ({total_units:,}) exceed required target ({required:,}) in year {entry['year']}")
                print(f"Breakdown for {entry['year']}:")
                print(f"- Required target: {required:,}")
                print(f"- Total units: {total_units:,}")
                for component_name, component_value in components.items():
                    print(f"  • {component_name.title()}: {component_value:,}")
                print(f"  • Percentage of target: {(total_units/required*100):.1f}%")
                return False
            
            # Print validation info for each year
            print(f"\nValidating year {entry['year']}:")
            print(f"- Required target: {required:,}")
            print(f"- Total units: {total_units:,}")
            for component_name, component_value in components.items():
                print(f"  • {component_name.title()}: {component_value:,} ({(component_value/required*100):.1f}% of target)")
            print(f"- Total percentage of target: {(total_units/required*100):.1f}%")
                
            prev_marketed = entry['marketed']
            
        # Print summary
        print("✅ Validation passed successfully!")
        print("\nSummary:")
        print(f"Total years: {len(years_data)}")
        print(f"First year: {years_data[0]['year']}")
        print(f"Last year: {years_data[-1]['year']}")
        last_year = years_data[-1]
        print(f"Final year breakdown:")
        print(f"- Required target: {last_year['required']:,}")
        print(f"- Total units: {last_year['marketed'] + last_year['submitted'] + last_year['planned']:,}")
        print(f"  • Marketed: {last_year['marketed']:,}")
        print(f"  • Submitted: {last_year['submitted']:,}")
        print(f"  • Planned: {last_year['planned']:,}")
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON format - {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    file_path = 'housingData2025-2040.json'
    if not validate_housing_data(file_path):
        sys.exit(1)
