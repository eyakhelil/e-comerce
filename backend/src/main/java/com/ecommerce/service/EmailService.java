package com.ecommerce.service;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderLine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendOrderConfirmationEmail(String to, Order order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("✅ Commande #" + order.getId() + " confirmée — E-Shop");
            helper.setText(buildHtmlEmail(order), true);

            mailSender.send(message);
            log.info("Order confirmation email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send order confirmation email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String to, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("🚀 Bienvenue chez E-Shop, " + name + " !");
            helper.setText(buildWelcomeHtml(name), true);

            mailSender.send(message);
            log.info("Welcome email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send welcome email to {}: {}", to, e.getMessage());
        }
    }

    private String buildWelcomeHtml(String name) {
        return """
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                  <meta charset="UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <title>Bienvenue chez E-Shop</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%%;">
                          <!-- Header -->
                          <tr>
                            <td style="background: linear-gradient(135deg, #4f46e5 0%%, #7c3aed 100%%); border-radius: 16px 16px 0 0; padding: 48px 40px; text-align: center;">
                              <div style="display: inline-block; background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px 24px; margin-bottom: 24px;">
                                <span style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">🛍️ E-Shop</span>
                              </div>
                              <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -1px;">Bienvenue parmi nous !</h1>
                              <p style="margin: 16px 0 0; font-size: 18px; color: rgba(255,255,255,0.9); line-height: 1.6;">Nous sommes ravis de vous compter parmi nos nouveaux clients.</p>
                            </td>
                          </tr>
                          <!-- Body -->
                          <tr>
                            <td style="background: #ffffff; padding: 48px 40px; border-radius: 0 0 16px 16px;">
                              <p style="margin: 0 0 24px; font-size: 18px; color: #1e293b; font-weight: 600;">Bonjour %s,</p>
                              <p style="margin: 0 0 24px; font-size: 16px; color: #475569; line-height: 1.7;">
                                Votre compte a été créé avec succès. Vous pouvez dès maintenant explorer nos collections, ajouter vos articles favoris au panier et profiter de nos meilleures offres.
                              </p>
                              <div style="text-align: center; margin: 40px 0;">
                                <a href="http://localhost:5173/" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%%, #7c3aed 100%%); color: #ffffff; font-size: 16px; font-weight: 700; padding: 16px 40px; border-radius: 12px; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">
                                  Commencer mes achats →
                                </a>
                              </div>
                              <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; margin-top: 40px;">
                                <h3 style="margin: 0 0 12px; font-size: 15px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.05em;">Prochaines étapes :</h3>
                                <ul style="margin: 0; padding: 0 0 0 20px; color: #475569; font-size: 15px; line-height: 1.6;">
                                  <li style="margin-bottom: 8px;">Complétez votre profil</li>
                                  <li style="margin-bottom: 8px;">Découvrez nos nouveautés</li>
                                  <li>Suivez vos commandes en temps réel</li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                          <!-- Footer -->
                          <tr>
                            <td style="padding: 32px 40px; text-align: center;">
                              <p style="margin: 0 0 12px; font-size: 14px; color: #64748b;">
                                © 2026 E-Shop — La meilleure expérience shopping.
                              </p>
                              <div style="font-size: 12px; color: #94a3b8;">
                                <a href="#" style="color: #64748b; text-decoration: underline;">Se désabonner</a> • 
                                <a href="#" style="color: #64748b; text-decoration: underline;">Politique de confidentialité</a>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(name);
    }

    private String buildHtmlEmail(Order order) {
        String orderDate = order.getCreatedAt() != null
                ? order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));

        StringBuilder rows = new StringBuilder();
        if (order.getOrderLines() != null) {
            for (OrderLine line : order.getOrderLines()) {
                double lineTotal = line.getUnitPrice().doubleValue() * line.getQuantity();
                rows.append("""
                        <tr>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9;">
                            <span style="font-weight: 600; color: #1e293b;">%s</span>
                          </td>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #64748b;">%d</td>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; text-align: right; color: #64748b;">€%.2f</td>
                          <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700; color: #4f46e5;">€%.2f</td>
                        </tr>
                        """.formatted(
                        line.getProduct() != null ? line.getProduct().getName() : "Produit",
                        line.getQuantity(),
                        line.getUnitPrice().doubleValue(),
                        lineTotal
                ));
            }
        }

        return """
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                  <meta charset="UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <title>Confirmation de commande</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%%;">

                          <!-- Header -->
                          <tr>
                            <td style="background: linear-gradient(135deg, #4f46e5 0%%, #7c3aed 100%%); border-radius: 16px 16px 0 0; padding: 40px 40px 32px; text-align: center;">
                              <div style="display: inline-block; background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px 24px; margin-bottom: 20px;">
                                <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">🛍️ E-Shop</span>
                              </div>
                              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Merci pour votre commande !</h1>
                              <p style="margin: 12px 0 0; font-size: 16px; color: rgba(255,255,255,0.85);">Votre commande a été confirmée et est en cours de traitement.</p>
                            </td>
                          </tr>

                          <!-- Order Info Banner -->
                          <tr>
                            <td style="background: #4f46e5; padding: 0 40px 24px;">
                              <table width="100%%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.12); border-radius: 12px; padding: 16px 20px;">
                                <tr>
                                  <td style="color: rgba(255,255,255,0.8); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Commande N°</td>
                                  <td style="color: rgba(255,255,255,0.8); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: right;">Date</td>
                                </tr>
                                <tr>
                                  <td style="color: #ffffff; font-size: 20px; font-weight: 800;">#%d</td>
                                  <td style="color: #ffffff; font-size: 15px; font-weight: 700; text-align: right;">%s</td>
                                </tr>
                              </table>
                            </td>
                          </tr>

                          <!-- Body -->
                          <tr>
                            <td style="background: #ffffff; padding: 40px;">

                              <!-- Status Badge -->
                              <div style="text-align: center; margin-bottom: 32px;">
                                <span style="display: inline-block; background: #ecfdf5; color: #059669; font-size: 13px; font-weight: 700; padding: 6px 18px; border-radius: 50px; border: 1px solid #a7f3d0;">
                                  ✔ Statut : %s
                                </span>
                              </div>

                              <!-- Order Table -->
                              <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 700; color: #1e293b;">Récapitulatif de votre commande</h2>
                              <table width="100%%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                                <thead>
                                  <tr style="background: #f8fafc;">
                                    <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0;">Produit</th>
                                    <th style="padding: 12px 16px; text-align: center; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0;">Qté</th>
                                    <th style="padding: 12px 16px; text-align: right; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0;">Prix unit.</th>
                                    <th style="padding: 12px 16px; text-align: right; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0;">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  %s
                                </tbody>
                              </table>

                              <!-- Grand Total -->
                              <table width="100%%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f5f3ff 0%%, #ede9fe 100%%); border-radius: 12px; padding: 20px 24px; margin-bottom: 32px;">
                                <tr>
                                  <td style="font-size: 16px; font-weight: 600; color: #64748b;">Total de la commande</td>
                                  <td style="font-size: 28px; font-weight: 800; color: #4f46e5; text-align: right;">€%.2f</td>
                                </tr>
                              </table>

                              <!-- CTA -->
                              <div style="text-align: center; margin-bottom: 32px;">
                                <a href="http://localhost:5173/orders" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%%, #7c3aed 100%%); color: #ffffff; font-size: 15px; font-weight: 700; padding: 14px 36px; border-radius: 12px; text-decoration: none; letter-spacing: -0.2px;">
                                  Voir mes commandes →
                                </a>
                              </div>

                              <!-- Info Box -->
                              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 16px 20px;">
                                <p style="margin: 0; font-size: 14px; color: #0369a1;">
                                  <strong>📦 Besoin d'aide ?</strong> Contactez notre support à <a href="mailto:support@eshop.com" style="color: #4f46e5; font-weight: 600;">support@eshop.com</a>. Nous vous répondrons dans les 24h.
                                </p>
                              </div>
                            </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                            <td style="background: #1e293b; border-radius: 0 0 16px 16px; padding: 28px 40px; text-align: center;">
                              <p style="margin: 0 0 8px; font-size: 16px; font-weight: 700; color: #ffffff;">🛍️ E-Shop</p>
                              <p style="margin: 0 0 12px; font-size: 13px; color: #94a3b8;">Votre marketplace de confiance</p>
                              <p style="margin: 0; font-size: 12px; color: #64748b;">
                                Vous recevez cet email car vous avez passé une commande sur E-Shop.<br/>
                                © 2026 E-Shop. Tous droits réservés.
                              </p>
                            </td>
                          </tr>

                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(
                order.getId(),
                orderDate,
                order.getStatus() != null ? order.getStatus() : "EN COURS",
                rows.toString(),
                order.getTotal() != null ? order.getTotal().doubleValue() : 0.0
        );
    }
}
