from __future__ import annotations

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class SiteContractTests(unittest.TestCase):
    def test_catalog_has_expected_localities(self) -> None:
        payload = json.loads(
            (ROOT / "docs/data/localidades.min.json").read_text(
                encoding="utf-8"
            )
        )

        self.assertEqual(payload["count"], 10601)
        self.assertEqual(len(payload["records"]), 10601)

    def test_sources_point_to_cloudflare_r2(self) -> None:
        config = json.loads(
            (ROOT / "docs/config/data-sources.json").read_text(
                encoding="utf-8"
            )
        )

        self.assertEqual(config["schema_version"], 2)

        expected_sources = {
            "catalog": "https://data.weathervar.com/data",
            "observations": "https://data.weathervar.com/observations",
            "forecasts": "https://data.weathervar.com/forecasts",
            "alerts": "https://data.weathervar.com/alerts",
            "radar": "https://data.weathervar.com/radar",
            "satellite": "https://data.weathervar.com/satellite",
        }

        for source_name, expected_base_url in expected_sources.items():
            with self.subTest(source=source_name):
                source = config[source_name]

                self.assertEqual(source["base_url"], expected_base_url)
                self.assertEqual(source["manifest"], "manifiesto.json")

                if source_name != "catalog":
                    self.assertTrue(source["enabled"])

        self.assertEqual(config["alerts"]["alerts"], "alertas.json")
        self.assertEqual(
            config["alerts"]["locality_map"],
            "localidades_alerta.min.json",
        )
        self.assertEqual(
            config["alerts"]["areas"],
            "areas_alerta.geojson",
        )

    def test_site_has_no_weather_cache(self) -> None:
        self.assertFalse((ROOT / "data/cache").exists())


if __name__ == "__main__":
    unittest.main()
